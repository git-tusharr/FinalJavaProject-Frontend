import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button
} from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function BrandStep({ onNext }) {

  const { productState, setProductState } = useProduct();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const res = await axios.get("http://localhost:8080/api/brands");
    setBrands(res.data);
  };

  const handleConfirm = () => {
    if (!selectedBrand) {
      toast.success("Please select a brand");
      return;
    }

    setProductState({
      ...productState,
      brandId: selectedBrand.id
    });
  onNext();
    toast.success("Brand selected successfully");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Brand
      </Typography>

      <Grid container spacing={2}>
        {brands.map((brand) => (
          <Grid item xs={12} md={4} key={brand.id}>
            <Card
              onClick={() => setSelectedBrand(brand)}
              sx={{
                cursor: "pointer",
                border:
                  selectedBrand?.id === brand.id
                    ? "2px solid #1976d2"
                    : "1px solid #ddd"
              }}
            >
              <CardMedia
                component="img"
                height="120"
                image={brand.logoUrl}
                alt={brand.name}
                sx={{ objectFit: "contain", p: 2 }}
              />
              <CardContent>
                <Typography align="center" fontWeight="bold">
                  {brand.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm Brand
        </Button>
      </Box>
    </Box>
  );
}
