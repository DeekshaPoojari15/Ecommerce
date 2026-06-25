import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";

export default function CartCard({ cart }) {
  return (
    <Card sx={{ mt: 1 }}>
      <CardContent>
        <Typography variant="h6">
          Shopping Cart
        </Typography>

        <Divider sx={{ my: 1 }} />

        {cart.products.map((item) => (
          <Typography key={item._id}>
            {item.name} × {item.quantity}
          </Typography>
        ))}

        <Typography sx={{ mt: 2 }}>
          Items: {cart.totalItems}
        </Typography>

        <Typography fontWeight="bold">
          Total: ₹{cart.totalAmount}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Checkout
        </Button>
      </CardContent>
    </Card>
  );
}