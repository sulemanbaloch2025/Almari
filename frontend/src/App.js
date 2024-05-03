import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import history from './Utilities/history';
import PrivateRoute from './Utilities/private-route';
import Home from './Home/Home';
import Chat from './Chat/Chat';
import Home2 from './components/Home2'
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail'
import MyProducts from './components/MyProducts';
import SearchResults from './components/SearchResults';
import ReportForm from './components/ReportForm';
import ReportsPage from './components/ReportsPage';
import Categories from './components/CategoryPage';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#58a5f0',
            main: '#0277bd',
            dark: '#004c8c',
        },
        secondary: {
            light: '#ffd95a',
            main: '#f9a825',
            dark: '#c17900',
            contrastText: '#212121',
        },
        background: {
            default: '#f0f0f0',
        },
    },
    typography: {
        useNextVariants: true,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Router history={history}>
                <Route path="/" exact component={Home} />
                <Route path="/home" exact component={Home2} />
                <PrivateRoute path="/chat" component={Chat} />
                <Route path="/add-product" exact component={AddProduct} />
                <Route path="/product/:productId" exact component={ProductDetail} />
                <Route path="/my-products/:userId" exact component={MyProducts} />
                <Route path="/search-results/:searchQuery" exact component={SearchResults} />
                <Route path="/report/:sellerId"  exact component={ReportForm} />
                <Route path="/reports/:userId" exact component={ReportsPage}/>
                <Route path="/category/:category" exact component={Categories}/>
                


                




                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
/*
   <Route path="/" exact component={Home} />
                    <PrivateRoute path="/chat" component={Chat} />
*/