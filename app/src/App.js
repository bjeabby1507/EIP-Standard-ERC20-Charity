import './App.css';
import React from 'react';
import {useState} from 'react';
import { ethers } from "ethers";
import { ABI, Contract } from './config';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function App() {

    // Network
    const [Chain_ID,SetChainId] = useState("");
    const [Chain_Number,SetChainNumber]=useState("");
    const [connButtonText, setConnButtonText]=useState('Connect Wallet');

    // Smart contract 
    const [Tokencontract,Setcontract]=useState("");
    const [TokenName,SetTokenName]=useState("");
    const [TotalSupply,SetTotalSupply]=useState(0);
    const [Decimals, SetDecimals]=useState(18);

    //addresses
    const [Owner,SetOwner]=useState("");
    const [Charity1, SetCharity1]=useState("");
    const [Charity2, SetCharity2]=useState("");
    const [User2, Setuser2]=useState("");
    const [Charity,SetCharity]=useState("");
    
    // Balance
    const [Cha1TokenBalance,SetCharity1TokenBalance]=useState(0);
    const [Cha2TokenBalance,SetCharity2TokenBalance]=useState(0);
    const [User2TokenBalance,SetUser2TokenBalance]=useState(0);
    
    // user Adresse wallet 
    const [myAddress,SetAddress] = useState("");
    const [TokenBalance,SetTokenBalance]=useState(0);

    // variable and display
    const [Amount,SetAmount]=useState(0);
    const [AddressTo,SetAddressTo]=useState("");
    const [Rate,SetRate]=useState(0);
    
    //const [errorMessage, setErrorMessage] =  useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    //Dialog
    const [showDialog, setShowDialog] = useState(false);
    const [showSign, setShowSign] = useState(false);
    const [mined, setMined] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");
    //click
    const [isToggleOn, setisToggleOn] = useState(false);

    async function handleClick() {
		setisToggleOn(!isToggleOn);
	};

    const [open, setOpen] = useState(false);
    const [openDefault, setOpenDefault] = useState(false);

    async function handleClick2 (){
    setOpen(!open)}
    ;

    async function handleClick3 (){
        setOpenDefault(!openDefault)}
        ;
    // update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		SetAddress(newAccount);
	};

    // reload the page to avoid any errors with chain change mid use of application
    const chainChangedHandler = () => {
		window.location.reload();
	};

    const submitForm = async (e: any) => {
        e.preventDefault();
    };

    // Connexion avec une extension web3
    async function Connexion(){
        console.log('Start Connexion with Metamask Wallet');
        // Cherche s'il y a une extension web3
        if(window.ethereum){
            console.log('Metamask Detected');
            try{
                // Demande la connexion du site avec l'extension web3
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                }).then( result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                }).catch(err => {
                    //setErrorMessage(err.message);
                });
                console.log('Connected');
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const Network = await provider.getNetwork(); // avoir le réseau
                const chainId = Network.chainId; // avoir le numéro du réseau
                const chain = Network.name; // avoir le nom du réseau
                // affectation des valeurs
                SetChainId(chain);
                SetChainNumber(chainId);
                
                console.log("chain: ",chain);
                console.log("chainId: ", chainId);

                try{
                    // Setcontract: affecte à Tokencontract les infos du Contrat pour pouvoir l'appeler
                    let contract = new ethers.Contract(Contract.toString(),ABI.abi, provider.getSigner());
                    const owner =  await contract.owner();
                    const name = await contract.name();
                    const decimals = await contract.decimals();
                    const isAd =(owner.toUpperCase() === myAddress.toUpperCase());

                    const charity1="0x136E66848623b92B925716c2Add523F81d49744B";
                    const charity2="0xA9Cc05f7E13d3ba7d8145102D771FB9066DB6C5c";
                    const user2="0x72058A90D1e227c3f7d81F79bd3c43361A7fbBa0";
                    
                    console.log(ABI.abi);
                    console.log(contract);
                    console.log("owner : ",owner.toUpperCase(), typeof owner);
                    console.log("myAddress : ",myAddress.toUpperCase(), typeof myAddress);
                    console.log("isAdmin : ", isAd);
                    console.log("name : ", name);
                    console.log("decimals : ",decimals);
                    //set
                    Setcontract(contract);
                    SetOwner(owner);
                    setIsAdmin(isAd);
                    
                    SetTokenName(name);
                    SetDecimals(decimals);
                    SetCharity1(charity1);
                    SetCharity2(charity2);
                    Setuser2(user2);
                }catch (e) {
                    
                    console.log("Error getting contract");
                    console.log(e);
                    alert('Something went wrong with the contrcat.');
                    //return;
                }
            } catch (error) {
                alert('You are not connected to your browser wallet.');
                //setErrorMessage(error.message);
                console.log(error);
                console.log('Not Connected');
            }
        }
        else{
            console.log('Metamask not Detected');
            alert('Metamask not Detected');
            //setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    // Get supply
    async function GetTotalSupply(){
        try{
            // Get the total supply in circulation/ minted
            const value = await Tokencontract.totalSupply();
            const balance = await Tokencontract.balanceOf(myAddress);
            const cha1balance = await Tokencontract.balanceOf(Charity1);
            const cha2balance = await Tokencontract.balanceOf(Charity2);
            const user2balance = await Tokencontract.balanceOf(User2);
            // set
            SetTotalSupply(value/ (10 ** Decimals));
            SetTokenBalance(balance/ (10 ** Decimals));
            SetCharity1TokenBalance(cha1balance/ (10 ** Decimals));
            SetCharity2TokenBalance(cha2balance/ (10 ** Decimals));
            SetUser2TokenBalance(user2balance/ (10 ** Decimals));
        }catch (error) {
            alert('Something went wrong, try again.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    //mint token
    async function Mint(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            const amount_send= Amount;
            const amnt = ethers.utils.parseEther(amount_send.toString());
            let transaction = await Tokencontract.mint(AddressTo,amnt);

            SetDialog(transaction);

        }catch (error) {
            alert('Something went wrong with the mint transaction');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //whitelistt address
    async function Whitelist(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            let transaction = await Tokencontract.addToWhitelist(AddressTo);

            SetDialog(transaction);
        }catch (error) {
            alert('Something went wrong with the whitelist transaction');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Contract Owner : set Rate
    async function SetCustumRate(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            let transaction = await Tokencontract.setSpecificRate(AddressTo,Amount*100);

            SetDialog(transaction);
        }catch (error) {
            alert('Something went wrong with the rate customization transaction.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //get whitelistt address rate
    async function GetRate(){
        try{
            const rate = await Tokencontract.whitelistedRate(AddressTo);
            const charity = await Tokencontract.SpecificDefaultAddress();
            console.log((rate/100).toString());
            SetRate((rate/100).toString());
            SetCharity(charity);
        }catch (error) {
            alert('Something went wrong, try again.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    //activate charity
    async function Activate(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            let transaction = await Tokencontract.setSpecificDefaultAddress(AddressTo);

            SetDialog(transaction);
        }catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //activate and customize charity
    async function ActivateCustum(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            let transaction = await Tokencontract.setSpecificDefaultAddressAndRate(AddressTo,Amount*100);

            SetDialog(transaction);
        }catch (error) {
            alert(error);
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Deactivate charity
    async function Deactivate(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            let transaction = await Tokencontract.DeleteDefaultAddress();

            SetDialog(transaction);
        }catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //transfer charity
    async function Transfer(){
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try{
            const amount_send= Amount;
            const amnt = ethers.utils.parseEther(amount_send.toString());
            let transaction = await Tokencontract.transfer(AddressTo,amnt);

            SetDialog(transaction);
        }catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Get dialog status
    async function SetDialog(transaction){
        try{
            setShowSign(false);
            await transaction.wait();
            setMined(true);
            setTransactionHash(transaction.hash);
            console.log("Successfull transaction, transaction hash:", transaction.hash);
        }catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    async function RemoveDialog(){
        try{
            setShowDialog(false);
            setShowSign(false);
            setMined(false);
            setTransactionHash("");
            console.log("transaction error , or reverted");
        }catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    const ConfirmDialog = () => {
        return <Dialog open={true}>
            <h3>
            {mined && 'Transaction Confirmed'}
            {!mined && !showSign && 'Confirming Your Transaction...'}
            {!mined && showSign && 'Please Sign to Confirm'}
            </h3>
            <div style={{textAlign: 'left', padding: '0px 20px 20px 20px'}}>
                {mined && <div>
                Your purchase has been confirmed and is on the blockchain.<br /><br />
                <a target="_blank" rel="noopener noreferrer" href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}>View on Etherscan</a>
                </div>}
                {!mined && !showSign && <div><p>Please wait while we confirm your transaction on the blockchain....</p></div>}
                {!mined && showSign && <div><p>Please sign to confirm your transaction.</p></div>}
            </div>
            <div style={{textAlign: 'center', paddingBottom: '30px'}}>
            {!mined && <CircularProgress />}
            </div>
            {mined && 
            <button onClick={() => {
                setShowDialog(false);
            }
            }>Close</button>}
        </Dialog>
        }
    
    // listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

    const buttons = [
        <Button onClick={Connexion}>{connButtonText}</Button>,
        <Button onClick={handleClick}>Network Info</Button>,
    ];

    function createNetworkData(name, data) {
        return { name, data };
    }
    
    const net_rows = [
        createNetworkData('Chain Id', Chain_ID),
        createNetworkData('chain Number',Chain_Number),
        createNetworkData('Wallet Address', myAddress),
    ];

    function createData(name, data) {
        return { name, data };
    }
    
    const rows = [
        createData('CharityToken contract', Tokencontract.address),
        createData('Contract owner',Owner),
        createData('Token', TokenName),
        createData('Charity1 Address', Charity1),
        createData('Charity2 Address', Charity2),
        createData('User2 Address', User2),
    ];

    const supply_rows = [
        createData('Total Supply', TotalSupply),
        createData('Your token Balance',TokenBalance),
        createData('Charity1 token Balance', Cha1TokenBalance),
        createData('Charity2 token Balance', Cha2TokenBalance),
        createData('User2 token Balance', User2TokenBalance),
    ];

    return ( 
    < div className = "App" >
        <div className="Title" style={{ width: '100%' }}>
            <Box
            sx={{
                display: 'flex',
                '& > *': {
                m: 4,
                },
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: 'auto',
            }}
            >
            <h1 sx={{ width: '100%', fontFamily: 'Monospace' }}>A demonstration of the EIP-XXX : Charity</h1>
            {/*{isToggleOn ? 'ON' : 'OFF'}*/}
            <ButtonGroup
                orientation="vertical"
                aria-label="vertical contained button group"
                variant="outlined"
                sx={{ boxShadow: 1,flexShrink: 1  }}
            >
                {buttons}
            </ButtonGroup>
            </Box>
        </div>
        <div>
            {isToggleOn &&
                <TableContainer component={Paper } elevation={16} 
                sx={{":hover": {boxShadow: 6,}, borderRadius: '16px',maxWidth: 460}} >
                    <Table sx={{ minWidth: 350 ,}} aria-label="simple table">
                        <TableBody>
                        {net_rows.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.data}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
        </div>

        <br />
        <div className="Infos">
            <TableContainer component={Paper} elevation={6}  sx={{borderRadius: '16px',maxWidth: 860}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.data}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
            <br />
        <div className="Supply">
            <TableContainer component={Paper} elevation={6} sx={{borderRadius: '16px',maxWidth: 460}}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableBody>
                    {supply_rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.data}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell align="center" colSpan={2}><Button variant="outlined" color="primary" onClick={GetTotalSupply}>Total Supply</Button></TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        
        {/*{isAdmin ? "true" : "false"} */}
        <br />
        <div>
        <Box
            component="form"
            onSubmit={submitForm}
            noValidate
            autoComplete="off"
            >
            {isAdmin &&
            <List
                sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Actions (Only contract owner)
                    </ListSubheader>
                }
                >
                <ListItemButton onClick={handleClick2}>
                    <ListItemText primary="Mint" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Address to send"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-number"
                            label="Amount of token to mint"
                            type="number"
                            size="small"
                            value={Amount || ""}
                            onChange={(e) => SetAmount(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button variant="outlined" color="secondary" size="large" onClick={Mint}>Mint</Button>
                    </div>
                </Collapse>
                <ListItemButton onClick={handleClick2}>
                    <ListItemText primary="Whitelist charity address" />
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Charity address"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                            <Button variant="outlined" color="secondary" size="large" onClick={Whitelist}>Whitelist</Button>
                    </div>
                </Collapse>
                <ListItemButton onClick={handleClick2}>
                    <ListItemText primary="Custom Rate" />
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Charity address"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-number"
                            label="Custom rate"
                            type="number"
                            size="small"
                            value={Amount || ""}
                            onChange={(e) => SetAmount(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button variant="outlined" color="secondary" size="large" onClick={SetCustumRate}>Customize</Button>
                    </div>
                </Collapse>
                </List>
            }
            <List
            sx={{ width: '100%', maxWidth: 660, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                Actions
                </ListSubheader>
            }
            >
                <ListItemButton>
                    <ListItemText primary="Charity info" />
                </ListItemButton>
                <ListItem>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Charity address"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                        <Button variant="outlined" color="secondary" size="large" onClick={GetRate}>Get Info</Button>
                        <p> Default rate: {Rate} %</p>
                        <p> User registered address: {Charity}</p>
                    </div>
                </ListItem>
                <ListItemButton onClick={handleClick3}>
                    <ListItemText primary="Activate" />
                    {openDefault ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDefault} timeout="auto" unmountOnExit>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Charity address"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                        <Button variant="outlined" color="secondary" size="large" onClick={Activate}>Activate</Button>
                    </div>
                </Collapse>
                <ListItemButton onClick={handleClick3}>
                    <ListItemText primary="Customize + Activate" />
                </ListItemButton>
                <Collapse in={openDefault} timeout="auto" unmountOnExit>
                <div>
                    <TextField
                        required
                        id="outlined-required"
                        label="Charity address"
                        size="small"
                        value={AddressTo|| ""} 
                        onChange={(e) => SetAddressTo(e.target.value)}
                    />
                    <TextField
                            required
                            id="outlined-number"
                            label="Customize rate"
                            type="number"
                            size="small"
                            value={Amount || ""}
                            onChange={(e) => SetAmount(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    <Button variant="outlined" color="secondary" size="large" onClick={ActivateCustum}>Customize + Activate</Button>
            </div>
                </Collapse>
                <ListItemButton>
                    <ListItemText primary="Transfer" />
                </ListItemButton>
                <ListItem>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Address to send"
                            size="small"
                            value={AddressTo|| ""} 
                            onChange={(e) => SetAddressTo(e.target.value)}
                        />
                        <TextField
                                required
                                id="outlined-number"
                                label="Amount of token to transfer"
                                type="number"
                                size="small"
                                value={Amount || ""}
                                onChange={(e) => SetAmount(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        <Button variant="outlined" color="secondary" size="large" onClick={Transfer}>Transfer</Button>
                    </div>
                </ListItem>
            </List>
            <br />
            <div>
                <Button variant="contained" color="secondary" size="large" onClick={Deactivate}>Deactivate Donations</Button>
            </div>
        </Box>
        </div>
        {/*<h5> Amount : {Amount}</h5>
        <h5> to : {AddressTo}</h5>
        {errorMessage}*/}
        {showDialog && <ConfirmDialog />}
        </div>
    );
}
export default App;

