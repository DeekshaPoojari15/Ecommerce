import React, { useState } from "react";
import {
  Drawer,
  Fab,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Divider,
  bottomNavigationClasses,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProductCard from "./ProductCard";
import CartCard from "./CartCard";
import OrderCard from "./OrderCard";


export default function EcommerceChatbot() {
  const { token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can help with products, orders, cart, returns and FAQs.",
    },
  ]);

  useEffect(() => {
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }
}, [messages]);

 const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;

    // Add user message
    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: question,
          userId: JSON.parse(localStorage.getItem("user")).id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      // Adjust according to your backend response
      const botMessage = {
        role: "assistant",
        type: response.data.type,
        content: response.data.message,
        products: response.data.products || [],
        orders: response.data.orders || [],
        cart: response.data.cart || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I am unable to process your request right now.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <ChatIcon />
      </Fab>}


      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Shopping Assistant
            </Typography>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Quick Actions
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip label="Track Order" />
              <Chip label="Find Products" />
              <Chip label="Cart Help" />
              <Chip label="Returns" />
            </Box>
          </Box>

          <Divider />

          {/* Chat Messages */}
          <Box
           ref={messagesContainerRef}
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: "#f5f7fa",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    backgroundColor:
                      msg.role === "user"
                        ? "#1976d2"
                        : "#ffffff",
                    color:
                      msg.role === "user"
                        ? "#ffffff"
                        : "#000000",
                    boxShadow: 2,
                  }}
                >
                  {msg.content}

                  {/* Product Cards */}
                  {msg.type === "products" &&
                     msg.products?.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    )) }

                  {/* Order Card */}
                  {msg.type === "orders" &&  
                  msg.orders?.map((order) => (
                    <OrderCard order={order} key={order._id} />
                  )) 
                  
                  
                  }

                  {/* Cart Card */}
                  {/* {msg.type === "cart" && msg.content ? msg.content :
                    <CartCard cart={msg.cart} />
                  } */}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input Section */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about products, orders or cart..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
            />

            <Button
              variant="contained"
              onClick={handleSend}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}