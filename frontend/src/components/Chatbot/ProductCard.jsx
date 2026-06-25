import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

export default function ProductCard({ product }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        height="150"
        image={product.image}
        alt={product.name}
      />

      <CardContent>
        <Typography variant="subtitle1">
          {product.name}
        </Typography>

        <Typography color="primary">
          ₹{product.price}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}