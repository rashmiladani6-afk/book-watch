import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, CheckCircle } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const bookingData = location.state;

  if (!bookingData) {
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

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setPaymentSuccess(true);
    toast.success('Booking confirmed successfully!');
  };

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
                onClick={handlePayment}
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