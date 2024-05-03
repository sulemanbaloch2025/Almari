### Almari: A College Marketplace App

Welcome to Almari, a modern, secure, and specialized marketplace web application tailored specifically for college students in the United States. Designed to enable students to safely buy, sell, and exchange items within their college community, Almari offers a user-friendly interface and robust backend, ensuring a secure transaction environment.

#### Project Overview

Almari addresses the risks associated with traditional online marketplaces like scams and theft by providing a platform where transactions are confined to verified college students. Students can log in using their school-specific `.edu` email addresses, list items for sale, communicate via a built-in chat feature, and more—all within a secure and closed environment.

#### Key Features

- **User Authentication:** Secure login with school-provided `.edu` email addresses.
- **Item Listing:** Users can list items with details like title, description, price, and condition.
- **Advanced Search:** Filter search results by price range, condition, or category.
- **Real-Time Chat:** Communicate securely with other students using the built-in chat functionality.

#### Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** OAuth with JWT for secure access
- **Real-Time Communication:** Socket.IO

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/almari.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd almari
   ```

3. **Install dependencies for frontend**
   ```bash
   cd frontend
   npm install
   ```
4. **Install dependencies for backend**
   ```bash
   cd backend
   npm install
   ```

5. **Configure environment variables**
   Add your MongoDB connection string to mongoUR in backend/config/keys.js

6. **Run the application**
  a. Run the server
   ```bash
   cd backend
   npm start
   ```
 b. Run the client
   ```bash
   cd frontend
   npm start
   ```

#### Usage

- **Register/Login:** Access the application through your web browser and sign up or log in using your college email.
- **Navigating the UI:** Use the navigation bar to access different sections like Home, Sell, Add Product, My Adds, Chats, and Reports.
- **Listing an Item:** Go to the 'Add Product' tab, fill out the item details form, and submit it to list your item.
- **Buying an Item:** Browse available listings, use the chat option to communicate with sellers, and finalize transactions.
- **Check Reports:** Check reports made by users about your products

