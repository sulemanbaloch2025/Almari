import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '../Services/authenticationService';
import history from '../Utilities/history';
import logo from './logo.png';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuIcon from '@material-ui/icons/Menu'; // Import the Menu icon component
import IconButton from '@material-ui/core/IconButton'; // Import IconButton




const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        display: 'flex',
        color: 'black',
        
    },
    appBar: {
        height: '80px',
        backgroundColor: 'white !important'
        
    },
    userDropdown: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        padding: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            marginLeft: 'auto',
        },
        color: 'black',
        fontFamily: 'Times New Roman',
    },
    searchInput: {
        color: 'black',
        marginRight: theme.spacing(40),
        marginTop: theme.spacing(1),
        justifyContent: 'center', // Center the logo and link
        borderRadius: '15px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'black', // Removes the border
                borderRadius: '25px',
            },
            '&:hover fieldset': {
                borderColor: 'black', // Removes the border on hover
                borderRadius: '25px'
            },
            '&.Mui-focused fieldset': {
                borderColor: 'black', // Removes the border on focus
                borderRadius: '25px',
            },
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(1), // Adjust padding to match your design
        },
        width: '100%', // This will make the search input full-width within its container
        maxWidth: '500px', 
        color: 'black',
        


    },
    button: {
        // If you have a button class already, adjust the marginTop here
        marginTop: theme.spacing(1), // Adjust this value as needed to push the buttons down
        color: 'black',
        fontFamily: 'Times New Roman', // Replace "Font Name" with your font name

        // ... any other button styles ...
    },
}));

const Header = () => {
    const [currentUser] = useState(authenticationService.currentUserValue);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);  //
    const history = useHistory();

    const handleDropClose = () => {
        setDropdownOpen(false);
        setAnchorEl(null);
    };

   

    const handleDropOpen = event => {
        setDropdownOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        authenticationService.logout();
        history.push('/');
    };

    
    const handleSearch = async () => {
        const searchURL = `http://localhost:4000/api/products/search?search=${encodeURIComponent(searchQuery)}`;
        try {
            const response = await fetch(searchURL);
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                console.log('Search results:', data.products); 
                history.push(`/search-results/${encodeURIComponent(searchQuery)}`);



            } else {
                console.error('Search failed:', data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const arrowIcon = () => {
        return dropdownOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
    };

    const handleAddProduct = () => { // Define function to handle product addition
        history.push('/add-product');
    };

    const handleMyAdds = () => { // Define function to navigate to user's ads
        history.push(`/my-products/${currentUser.userId}`);
    };

    const handleChats = () => { // Define function to navigate to chat page
        history.push('/chat');
    };

    const handleHome = () => { // Define function to navigate to home page
        history.push('/home');
    };

    const handleReports = () => {
        history.push(`/reports/${currentUser.userId}`);
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" classes={{ colorPrimary: classes.appBar }}>
                <Toolbar>
                    <Link href="/" className={classes.title}>
                        <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto',  marginTop: '10px', }} />
                    </Link>
                    <TextField
                            placeholder="Search and hit the search icon"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className={classes.searchInput}
                            variant="outlined"
                            size="small"
                            style={{ backgroundColor: '#f9f9f9' }} 
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <IconButton onClick={handleSearch}>  {/* Add this line to make the icon clickable */}
                                        <FontAwesomeIcon icon={faSearch} />
                                    </IconButton>
                                </InputAdornment>
                                ),
                            }}
                        />
                    <Button
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={handleDropOpen}
                        className={classes.userDropdown}
                        color="inherit"
                        size="large"
                    >
          
                        {currentUser.name}
          
                        {arrowIcon()}
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleDropClose}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        <MenuItem onClick={handleAddProduct}>Add Product</MenuItem>
                        <MenuItem onClick={handleMyAdds}>My Adds</MenuItem>
                        <MenuItem onClick={handleChats}>Chats</MenuItem>
                        <MenuItem onClick={handleHome}>Home</MenuItem>
                        <MenuItem onClick={handleReports}>Reports</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
