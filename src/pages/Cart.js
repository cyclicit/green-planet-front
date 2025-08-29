import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // Add safety check for items
  if (!items || items.length === 0) {
    return (
      <Container>
        <Title>Shopping Cart</Title>
        <EmptyCart>
          <EmptyMessage>Your cart is empty</EmptyMessage>
          <ContinueShopping href="/products">Continue Shopping</ContinueShopping>
        </EmptyCart>
      </Container>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert('Thank you for your purchase! This is a demo - no actual payment will be processed.');
    clearCart();
  };

  return (
    <Container>
      <Title>Shopping Cart</Title>
      
      <CartItems>
        {items.map(item => (
          <CartItem key={item._id}>
            <ItemImage 
              src={item.images && item.images[0] 
                ? `https://green-planet-moc.onrender.com/${item.images[0]}` 
                : '/placeholder-plant.jpg'
              } 
              alt={item.name}
            />
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemCategory>{item.category}</ItemCategory>
              <ItemPrice>${item.price}</ItemPrice>
            </ItemDetails>
            <QuantityControls>
              <QuantityButton 
                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
              >
                -
              </QuantityButton>
              <Quantity>{item.quantity}</Quantity>
              <QuantityButton 
                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
              >
                +
              </QuantityButton>
            </QuantityControls>
            <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
            <RemoveButton onClick={() => removeFromCart(item._id)}>
              Remove
            </RemoveButton>
          </CartItem>
        ))}
      </CartItems>

      <CartSummary>
        <TotalAmount>Total: ${getCartTotal().toFixed(2)}</TotalAmount>
        <CheckoutButton onClick={handleCheckout}>
          Proceed to Checkout
        </CheckoutButton>
        <ClearCartButton onClick={clearCart}>
          Clear Cart
        </ClearCartButton>
      </CartSummary>
    </Container>
  );
};
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2e7d32;
  text-align: center;
  margin-bottom: 2rem;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ContinueShopping = styled.a`
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const CartItems = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-areas: 
      "image details"
      "quantity total"
      "remove remove";
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    grid-area: image;
    width: 80px;
    height: 80px;
  }
`;

const ItemDetails = styled.div`
  @media (max-width: 768px) {
    grid-area: details;
  }
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ItemCategory = styled.span`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ItemPrice = styled.p`
  margin: 0.5rem 0 0 0;
  color: #2e7d32;
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-area: quantity;
    justify-self: start;
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #f5f5f5;
  }
`;

const Quantity = styled.span`
  padding: 0 1rem;
  font-weight: bold;
`;

const ItemTotal = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #2e7d32;

  @media (max-width: 768px) {
    grid-area: total;
    justify-self: end;
  }
`;

const RemoveButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #ff3742;
  }

  @media (max-width: 768px) {
    grid-area: remove;
    justify-self: stretch;
  }
`;

const CartSummary = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const TotalAmount = styled.h2`
  color: #2e7d32;
  margin-bottom: 1.5rem;
`;

const CheckoutButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    background: #388e3c;
  }
`;

const ClearCartButton = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #e85a2a;
  }
`;

export default Cart;