import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getDonations();
      setDonations(data);
      setError('');
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load donation posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    if (!user) {
      alert('Please login to claim a donation');
      return;
    }

    try {
      const message = prompt('Please leave a message for the donor:');
      if (!message) return;

      await api.claimDonation(donationId, message);
      alert('Claim request sent successfully! The donor will review your request.');
      fetchDonations(); // Refresh the list
    } catch (error) {
      alert('Error claiming donation: ' + (error.message || 'Unknown error'));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: '#28a745', text: 'Available' },
      claimed: { color: '#ffc107', text: 'Claimed' },
      donated: { color: '#6c757d', text: 'Donated' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return <StatusBadge color={config.color}>{config.text}</StatusBadge>;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </LoadingSpinner>
        <LoadingText>Loading donations...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={fetchDonations}>Try Again</RetryButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Plant Donations</Title>
        <Subtitle>Find free plants from generous community members</Subtitle>
      </Header>

      <Stats>
        <StatItem>
          <StatNumber>{donations.length}</StatNumber>
          <StatLabel>Total Donations</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>
            {donations.filter(d => d.status === 'available').length}
          </StatNumber>
          <StatLabel>Available Now</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>
            {donations.filter(d => d.status === 'donated').length}
          </StatNumber>
          <StatLabel>Successfully Donated</StatLabel>
        </StatItem>
      </Stats>

      <DonationGrid>
        {donations.map(donation => (
          <DonationCard key={donation._id}>
            <DonationHeader>
              <DonationTitle>{donation.plantName}</DonationTitle>
              {getStatusBadge(donation.status)}
            </DonationHeader>
            
            <DonationImage>
              {donation.images && donation.images[0] ? (
                <img src={`https://green-planet-moc.onrender.com/${donation.images[0]}`} alt={donation.plantName} />
              ) : (
                <PlaceholderImage>🌿</PlaceholderImage>
              )}
            </DonationImage>
            
            <DonationContent>
              <DonationDescription>
                {donation.description}
              </DonationDescription>
              
              <DonationDetails>
                <DetailItem>
                  <DetailLabel>📍 Location</DetailLabel>
                  <DetailValue>{donation.location}</DetailValue>
                  
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>👤 Donor</DetailLabel>
                  <DetailValue>{donation.ccc}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>📅 Posted</DetailLabel>
                  <DetailValue>{formatDate(donation.createdAt)}</DetailValue>
                </DetailItem>
              </DonationDetails>
              
              {donation.status === 'available' && (
                <ClaimButton 
                  onClick={() => handleClaim(donation._id)}
                  disabled={!user}
                >
                  {user ? 'Claim This Plant' : 'Login to Claim'}
                </ClaimButton>
              )}
              
              {donation.status !== 'available' && (
                <StatusMessage>
                  This plant is no longer available for claiming.
                </StatusMessage>
              )}
            </DonationContent>
          </DonationCard>
        ))}
      </DonationGrid>

      {donations.length === 0 && !loading && (
        <NoDonations>
          <NoDonationsIcon>🤝</NoDonationsIcon>
          <NoDonationsText>No donations available yet</NoDonationsText>
          <NoDonationsSubtext>Be the first to offer a plant to the community!</NoDonationsSubtext>
        </NoDonations>
      )}
    </Container>
  );
};

// Reuse the same styled components from previous pages with some adjustments
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #2e7d32;
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 15px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

const DonationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const DonationCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const DonationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
`;

const DonationTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const StatusBadge = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const DonationImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: #e8f5e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const DonationContent = styled.div`
  padding: 1.5rem;
`;

const DonationDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const DonationDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
`;

const DetailLabel = styled.span`
  color: #888;
  font-weight: 500;
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const ClaimButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.disabled ? '#ccc' : '#2e7d32'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#388e3c'};
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const NoDonations = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const NoDonationsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NoDonationsText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const NoDonationsSubtext = styled.p`
  color: #888;
`;

// Reuse loading and error components from Products page
const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 2rem auto;
  display: block;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #2e7d32;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #2e7d32 transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
  border: 1px solid #f5c6cb;
`;

const RetryButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #388e3c;
  }
`;

export default Donations;