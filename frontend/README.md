# Todo App Web3 - Frontend

A modern React frontend for the Web3 Todo Application.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the frontend directory with:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   ```

3. **Get WalletConnect Project ID:**
   - Go to https://cloud.walletconnect.com/ or https://cloud.reown.com/
   - Create a new project
   - Copy the Project ID and add it to your `.env` file

4. **Deploy the smart contract:**
   - Go to the root directory
   - Run: `npx hardhat ignition deploy ./ignition/modules/TodoList.js`
   - Copy the deployed contract address and add it to `VITE_CONTRACT_ADDRESS`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🎨 Features

- **Wallet Connection**: Connect with MetaMask, WalletConnect, and other wallets
- **Todo Management**: Add, edit, toggle, and delete todos
- **Blockchain Integration**: All todos are stored on the blockchain
- **Modern UI**: Beautiful dark theme with smooth animations
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **React 19**: Modern React with hooks
- **Vite**: Fast build tool
- **@reown/appkit**: Modern Web3 toolkit
- **Ethers.js**: Blockchain interaction
- **Tailwind-inspired CSS**: Custom styling with the project's color scheme

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Add Todo**: Type a todo and click "Add"
3. **Toggle Complete**: Click the circle button to mark as complete
4. **Edit Todo**: Click "Edit" to modify a todo
5. **Delete Todo**: Click "Delete" to remove a todo

## 🔧 Development

- **Components**: Located in `src/components/`
- **Styling**: Custom CSS in `src/App.css`
- **Web3 Setup**: Configured in `src/Web3Provider.jsx`

## 🚀 Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform:**
   - Vercel, Netlify, or any static hosting service

3. **Update environment variables** for production:
   - Use your mainnet contract address
   - Update the URL in the metadata

## 🎯 Color Scheme

- **Main**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Background**: #0f172a (Dark blue)
- **Text**: #f8fafc (Light gray)
- **Accent**: #f59e0b (Amber)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
