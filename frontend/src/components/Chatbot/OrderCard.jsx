import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";

export default function OrderCard({ order }) {
 
  return (
    <Card sx={{ mt: 1 }}>
      <CardContent>
        <Typography variant="subtitle1">
          Order #{order._id}
        </Typography>

        <Chip
          label={order.status}
          color={
            order.status === "Delivered"
              ? "success"
              : "primary"
          }
          sx={{ mt: 1 }}
        />

        <Typography sx={{ mt: 1 }}>
          Amount: ₹{order.totalAmount}
        </Typography>

        <Typography variant="body2">
          Date: {order.createdAt}
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        >
          View Order
        </Button>
      </CardContent>
    </Card>
  );
}