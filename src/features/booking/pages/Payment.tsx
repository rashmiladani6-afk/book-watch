import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import Header from '@/shared/components/layout/Header';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useVerifyPayment } from '@/features/payment/hooks/useVerifyPayment';
import { isEventPaymentState, type EventPaymentState } from '@/features/payment/types/payment';
import { paymentService } from '@/features/payment/services/paymentService';
import { openCashfreeCheckout } from '@/features/payment/utils/cashfreeCheckout';
import {
  clearPendingEventPayment,
  getPendingEventPayment,
  normalizeEventPaymentState,
  savePendingEventPayment,
} from '@/features/payment/utils/paymentStorage';
import { getAuthUrl } from '@/lib/auth/authRedirect';
import { ROUTES } from '@/shared/constants/routes';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [openingCashfree, setOpeningCashfree] = useState(false);
  const [refreshingOrder, setRefreshingOrder] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [cashfreeCompleted, setCashfreeCompleted] = useState(false);
  const [paymentState, setPaymentState] = useState<EventPaymentState | null>(null);

  const userToken = session?.access_token ?? null;

  const bookingData = location.state;
  const orderIdFromUrl = searchParams.get('order_id');

  const eventPayment = useMemo(() => {
    if (isEventPaymentState(bookingData)) {
      return normalizeEventPaymentState(bookingData);
    }

    const pending = getPendingEventPayment();
    if (!pending) return null;

    if (orderIdFromUrl && pending.orderId !== orderIdFromUrl) {
      return null;
    }

    return pending;
  }, [bookingData, orderIdFromUrl]);

  useEffect(() => {
    if (eventPayment) {
      setPaymentState(eventPayment);
      savePendingEventPayment(eventPayment);
    }
  }, [eventPayment]);

  const activePayment = paymentState ?? eventPayment;

  useEffect(() => {
    if (orderIdFromUrl || searchParams.get('payment_status')) {
      setCashfreeCompleted(true);
    }
  }, [orderIdFromUrl, searchParams]);

  const verifyPayment = useVerifyPayment(userToken, {
    onError: (message) => {
      toast.error(message);
    },
  });

  if (!bookingData && !activePayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No booking data found</p>
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRefreshOrder = async () => {
    if (!activePayment) return;
    if (!userToken) {
      toast.error('Sign in to refresh payment');
      navigate(getAuthUrl(`${ROUTES.PAYMENT}?order_id=${activePayment.orderId}`));
      return;
    }

    setRefreshingOrder(true);
    try {
      const gatewayResult = await paymentService.getPaymentGateway(userToken);
      const gateway = gatewayResult.status === 'success' ? gatewayResult.data : null;
      if (!gateway?.id) {
        toast.error(gatewayResult.message || 'Payment gateway unavailable');
        return;
      }

      const orderResult = await paymentService.createOrder(
        {
          eventId: activePayment.eventId,
          ticketId: activePayment.ticketId,
          qty: activePayment.qty,
          paymentProviderId: gateway.id,
        },
        userToken,
      );

      if (orderResult.status !== 'success' || !orderResult.data?.order_id) {
        toast.error(orderResult.message || 'Could not refresh order');
        return;
      }

      const updated = normalizeEventPaymentState({
        ...activePayment,
        orderId: orderResult.data.order_id,
        paymentSessionId: orderResult.data.payment_session_id,
        paymentProviderId: gateway.id,
        paymentProviderName: gateway.name,
        gatewayState: gateway.state,
      });

      setPaymentState(updated);
      savePendingEventPayment(updated);
      toast.success('Payment order refreshed. Try Pay with Cashfree again.');
    } catch {
      toast.error('Could not refresh order. Please go back to cart and try again.');
    } finally {
      setRefreshingOrder(false);
    }
  };

  const handleVerifyEventPayment = async () => {
    if (!activePayment) return;
    if (!userToken) {
      toast.error('Sign in to verify payment');
      navigate(getAuthUrl(`${ROUTES.PAYMENT}?order_id=${activePayment.orderId}`));
      return;
    }

    const result = await verifyPayment.mutateAsync({
      orderId: activePayment.orderId,
      paymentProviderId: activePayment.paymentProviderId,
    });

    if (result.status === 'success') {
      setTransactionId(result.data?.transaction_id ?? null);
      setPaymentSuccess(true);
      clearPendingEventPayment();
      toast.success(result.message || 'Payment verified successfully');
      return;
    }

    const message = result.message || 'Payment verification failed';
    toast.error(message);
    if (message.toLowerCase().includes('sign in')) {
      navigate(getAuthUrl(`${ROUTES.PAYMENT}?order_id=${activePayment.orderId}`));
    }
  };

  const handleOpenCashfree = async () => {
    if (!activePayment?.paymentSessionId) {
      toast.error('Payment session is missing. Tap Refresh order or go back to cart.');
      return;
    }
    if (!userToken) {
      toast.error('Sign in to continue payment');
      navigate(getAuthUrl(`${ROUTES.PAYMENT}?order_id=${activePayment.orderId}`));
      return;
    }

    setOpeningCashfree(true);
    try {
      const returnUrl = `${window.location.origin}${ROUTES.PAYMENT}?order_id=${encodeURIComponent(activePayment.orderId)}`;
      await openCashfreeCheckout({
        paymentSessionId: activePayment.paymentSessionId,
        gatewayState: activePayment.gatewayState,
        returnUrl,
      });
      setCashfreeCompleted(true);
    } catch (err: unknown) {
      const message =
        (err as Error)?.message || 'Could not open Cashfree checkout. Please try again.';
      toast.error(message);
      if (message.toLowerCase().includes('session')) {
        toast.info('Tap Refresh order to get a new payment session.');
      }
    } finally {
      setOpeningCashfree(false);
    }
  };

  const handleMoviePayment = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setPaymentSuccess(true);
    toast.success('Booking confirmed successfully!');
  };

  if (paymentSuccess && activePayment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your tickets have been booked successfully
              </p>
              <p className="font-medium">{activePayment.eventName}</p>
              <p className="text-sm capitalize">{activePayment.ticketType} ticket</p>
              <p className="text-sm">Qty: {activePayment.qty}</p>
              <p className="text-sm text-muted-foreground">Order: {activePayment.orderId}</p>
              {transactionId && (
                <p className="text-sm text-muted-foreground">Transaction: {transactionId}</p>
              )}
            </div>
            <Separator />
            {activePayment.summary && (
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid:</span>
                <span>₹{activePayment.summary.total_amount}</span>
              </div>
            )}
            <Link to={ROUTES.HOME} className="block">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activePayment) {
    const summary = activePayment.summary;
    const needsSignIn = !user || !userToken;

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {needsSignIn && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Your session expired.{' '}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        getAuthUrl(`${ROUTES.PAYMENT}?order_id=${activePayment.orderId}`),
                      )
                    }
                    className="font-medium underline"
                  >
                    Sign in again
                  </button>{' '}
                  to pay or verify.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{activePayment.eventName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {activePayment.ticketType} ticket · Qty {activePayment.qty}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Order ID: {activePayment.orderId}
                  </p>
                </div>

                <Separator />

                {summary ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{summary.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span>₹{summary.platform_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({summary.gst}%)</span>
                      <span>₹{summary.gst_amount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount</span>
                      <span>₹{summary.total_amount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Pay with Cashfree first, then verify your payment.
                  </p>
                )}

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium">
                    Payment gateway: {activePayment.paymentProviderName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Step 1: Tap <strong>Pay with Cashfree</strong> and complete payment in the
                    Cashfree test checkout.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Step 2: After payment succeeds, return here and tap{' '}
                    <strong>Verify Payment</strong>.
                  </p>
                  {cashfreeCompleted && (
                    <p className="text-xs font-medium text-[#955F3B]">
                      Payment window completed. You can verify now.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={openingCashfree || verifyPayment.isPending || refreshingOrder}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOpenCashfree}
                    disabled={openingCashfree || !activePayment.paymentSessionId || needsSignIn}
                    className="flex-1 bg-[#955F3B] hover:bg-[#7a4d30]"
                  >
                    {openingCashfree ? 'Opening Cashfree...' : 'Pay with Cashfree'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleVerifyEventPayment}
                    disabled={verifyPayment.isPending || openingCashfree || needsSignIn}
                    className="flex-1"
                  >
                    {verifyPayment.isPending ? 'Verifying...' : 'Verify Payment'}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleRefreshOrder}
                  disabled={refreshingOrder || needsSignIn}
                  className="w-full text-sm"
                >
                  {refreshingOrder ? 'Refreshing order...' : 'Refresh order (new payment session)'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your tickets have been booked successfully
              </p>
              <p className="font-medium">{bookingData.movieTitle}</p>
              <p className="text-sm">{bookingData.theaterName}</p>
              <p className="text-sm">{bookingData.showDate} at {bookingData.showTime}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Seats:</span>
                <span className="font-medium">{bookingData.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid:</span>
                <span>₹{bookingData.totalAmount}</span>
              </div>
            </div>
            <Link to="/" className="block">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{bookingData.movieTitle}</h3>
                <p className="text-sm text-muted-foreground">{bookingData.theaterName}</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.showDate} at {bookingData.showTime}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span className="font-medium">{bookingData.seats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Tickets:</span>
                  <span className="font-medium">{bookingData.seats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>₹{bookingData.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span>₹{(bookingData.totalAmount - (bookingData.basePrice * bookingData.seats.length)).toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span>₹{bookingData.totalAmount}</span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                This is a demo payment gateway. In production, integrate with actual payment services.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={processing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMoviePayment}
                disabled={processing}
                className="flex-1"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
