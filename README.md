# Elite Wardrobe

A sophisticated e-commerce platform designed for fashion enthusiasts.

## Tech Stack

![React.js](https://img.shields.io/badge/-React.js-61DAFB?style=flat-square&logo=react&logoColor=black)
![Shadcn](https://img.shields.io/badge/-Shadcn-000000?style=flat-square&logo=shadcn&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![Stripe](https://img.shields.io/badge/-Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white)
![React-Redux](https://img.shields.io/badge/-React_Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

## Overview

Elite Wardrobe is a sophisticated e-commerce platform designed for fashion enthusiasts. The application features a visually stunning product showcase with detailed views, size guides, and related item suggestions. Users can easily filter products by category, price range, and popularity, while the wishlist functionality allows them to save favorites for later. The checkout process is streamlined with Stripe integration for secure payments. The admin panel provides comprehensive inventory management, sales analytics, and customer insights.

## Key Features

- **Visually Stunning Product Showcase**: High-quality imagery with detailed product views
- **Size Guides**: Comprehensive sizing information for accurate purchases
- **Related Item Suggestions**: Smart recommendations based on browsing history
- **Advanced Product Filtering**: Filter by category, price range, and popularity
- **Wishlist Functionality**: Save favorite items for future consideration
- **Secure Checkout**: Streamlined payment process with Stripe integration
- **Admin Panel**: 
  - Inventory management
  - Sales analytics
  - Customer insights and behavior tracking

## Technical Architecture

- **Frontend**:
  - React.js for component-based UI development
  - Shadcn for consistent design components
  - Tailwind CSS for responsive styling
  - React-Redux for state management

- **Backend**:
  - Node.js and Express for API handling
  - MySQL database for product and user data storage
  - RESTful API architecture

- **Payment Processing**:
  - Stripe integration for secure transactions

- **Product Management**:
  - Custom filtering and sorting algorithms
  - Wishlist system with user accounts

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/NaveedAfraz/elite-wardrobe.git
   cd elite-wardrobe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration details
   ```

4. Set up the database
   ```bash
   npm run setup-db
   # or
   yarn setup-db
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```
## Development

### Running in Development Mode

```bash
# Start the frontend and backend concurrently
npm run dev
# or
yarn dev
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

1. Build the project
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server
   ```bash
   npm start
   # or
   yarn start
   ```

## Admin Access

To access the admin panel:
1. Navigate to `/admin`
2. Log in with admin credentials
3. You'll have access to inventory management, analytics, and customer insights

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Project Link: [https://github.com/yourusername/elite-wardrobe](https://github.com/yourusername/elite-wardrobe)

---

[Visit Project Website](https://elite-wardrobe.example.com) 
