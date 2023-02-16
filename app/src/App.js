import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

function App() {

    // Network
    const [Chain_ID, SetChainId] = useState("");
    const [Chain_Number, SetChainNumber] = useState("");
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    // Smart contract 
    const [Tokencontract, Setcontract] = useState("");
    const [TokenName, SetTokenName] = useState("");
    const [TokenSymbol, SetTokenSymbol] = useState("");
    const [TotalSupply, SetTotalSupply] = useState(0);
    const [Decimals, SetDecimals] = useState(18);

    //addresses
    const [Owner, SetOwner] = useState("");
    const [User2, Setuser2] = useState("");
    const [Charity, SetCharity] = useState([]);
    const [CharityAddresses, SetCharityAddresses] = useState([]);

    // Balance
    const [User2TokenBalance, SetUser2TokenBalance] = useState(0);

    // user Adresse wallet 
    const [myAddress, SetAddress] = useState("");
    const [TokenBalance, SetTokenBalance] = useState(0);

    // variable and display
    const [Amount, SetAmount] = useState(0);
    const [AddressToMint, SetAddressToMint] = useState("");
    const [AddressToWhitelist, SetAddressToWhitelist] = useState("");
    const [AddressToRemoveFromWhitelist, SetAddressToRemoveFromWhitelist] = useState("");
    const [AddressToCustomize, SetAddressToCustomize] = useState("");
    const [AddressToGetinfo, SetAddressToGetinfo] = useState("");
    const [AddressToActivate, SetAddressToActivate] = useState("");
    const [AddressToCustomizeActivate, SetAddressToCustomizeActivate] = useState("");
    const [AddressToSend, SetAddressToSend] = useState("");
    const [Rate, SetRate] = useState(0);
    const [Whitelisted, SetWhitelisted] = useState(0);
    const [beforeTransferView, SetBeforeTransfer] = useState([]);

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
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [openDefault, setOpenDefault] = useState(false);
    const [openDefault1, setOpenDefault1] = useState(false);
    const [openDefault2, setOpenDefault2] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);

    const [openTransfer, setOpenTransfer] = useState(false);
    const [openBeforeTransfer, setOpenBeforeTransfer] = useState(false);

    async function handleClick1() {
        setOpenInfo(!openInfo)
    }
    ;
    async function handleClick2(num) {
        if (num === 2.0) {
            setOpen(!open)
        }else if (num === 2.1) {
            setOpen1(!open1)
        }else if (num === 2.2) {
            setOpen2(!open2)
        }else if (num === 2.3) {
            setOpen3(!open3)
        }
        else {
            console.log("click2: " + num);
        }
    }
    ;

    async function handleClick3(num) {
        if (num === 3.0) {
            setOpenDefault(!openDefault)
        }else if (num === 3.1) {
            setOpenDefault1(!openDefault1)
        }else if (num === 3.2) {
            setOpenDefault2(!openDefault2)
        }else if (num === 3.3) {
            setOpenTransfer(!openTransfer)
        }
        else {
            console.log("click3: " + num);
        }
    }
    ;

    async function handleAdresses() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract(Contract.toString(), ABI.abi, provider.getSigner());
        let addresses = await contract.getAllWhitelistedAddresses();
        console.log("charity addresses: " + addresses);
        const items = await Promise.all(addresses.map(async (e, i) => {
            let rate = ((await contract.whitelistedRate(e)) / 100);
            let charityBalance = (await contract.balanceOf(e)) / (10 ** Decimals);
            let item = {
                id: i + 1,
                addresses: e.toLowerCase(),
                defaultRate: rate,
                balance: charityBalance,
            }
            return item
        }))
        SetCharityAddresses(items);
    }
    ;
    // update account, will cause component re-render
    const accountChangedHandler = (newAccount) => {
        SetAddress(newAccount);
        window.location.reload();
    };

    // reload the page to avoid any errors with chain change mid use of application
    const chainChangedHandler = () => {
        window.location.reload();
    };

    const submitForm = async (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        isConnected();
    }, []);

    // Connexion avec une extension web3
    async function isConnected() {
        console.log('Start Connexion with Metamask Wallet');
        // Cherche s'il y a une extension web3
        if (window.ethereum) {
            console.log('Metamask Detected');
            let account;
            try {
                // Demande la connexion du site avec l'extension web3
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                }).then(result => {
                    account = result[0];
                    SetAddress(account);
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

                console.log("chain: ", chain);
                console.log("chainId: ", chainId);

                try {
                    // Setcontract: affecte à Tokencontract les infos du Contrat pour pouvoir l'appeler
                    let contract = new ethers.Contract(Contract.toString(), ABI.abi, provider.getSigner());
                    const owner = await contract.owner();
                    const name = await contract.name();
                    const symbol = await contract.symbol();
                    const decimals = await contract.decimals();
                    const isAd = (owner.toUpperCase() === account.toUpperCase());

                    const user2 = "0x0591F951415Dc471Aa948A49E9Fe752ACB028E9B".toLowerCase();
                    handleAdresses();

                    console.log(ABI.abi);
                    console.log(contract);
                    console.log("owner : ", owner.toUpperCase(), typeof owner);
                    console.log("account : ", account.toUpperCase(), typeof account);
                    console.log("isAdmin : ", isAd);
                    console.log("name : ", name);
                    console.log("decimals : ", decimals);
                    //set
                    Setcontract(contract);
                    SetOwner(owner);
                    setIsAdmin(isAd);

                    SetTokenName(name);
                    SetTokenSymbol(symbol);
                    SetDecimals(decimals);
                    Setuser2(user2);
                } catch (e) {

                    console.log("Error getting contract");
                    console.log(e);
                    alert('Something went wrong with the contrcat.');
                    //return;
                }
            } catch (error) {
                setConnButtonText('Connect Wallet');
                alert('You are not connected to your browser wallet.');
                //setErrorMessage(error.message);
                console.log(error);
                console.log('Not Connected');
            }
        }
        else {
            console.log('Metamask not Detected');
            alert('Metamask not Detected');
            //setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }
    // Connexion avec une extension web3
    async function Connexion() {
        // Cherche s'il y a une extension web3
        if (window.ethereum) {
            let account;
            try {
                // Demande la connexion du site avec l'extension web3
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                }).then(result => {
                    account = result[0];
                    accountChangedHandler(account);
                    setConnButtonText('Wallet Connected');
                }).catch(err => {
                    //setErrorMessage(err.message);
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const Network = await provider.getNetwork(); // avoir le réseau
                const chainId = Network.chainId; // avoir le numéro du réseau
                const chain = Network.name; // avoir le nom du réseau
                // affectation des valeurs
                SetChainId(chain);
                SetChainNumber(chainId);

                try {
                    // Setcontract: affecte à Tokencontract les infos du Contrat pour pouvoir l'appeler
                    //let contract = new ethers.Contract(Contract.toString(), ABI.abi, provider.getSigner());
                    const user2 = "0x0591F951415Dc471Aa948A49E9Fe752ACB028E9B";
                    Setuser2(user2);
                } catch (e) {

                    console.log("Error getting contract");
                    console.log(e);
                    alert('Something went wrong with the contrcat.');
                    //return;
                }
            } catch (error) {
                setConnButtonText('Connect Wallet');
                alert('You are not connected to your browser wallet.');
                //setErrorMessage(error.message);
                console.log(error);
                console.log('Not Connected');
            }
        }
        else {
            console.log('Metamask not Detected');
            alert('Metamask not Detected');
            //setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    // Get supply
    async function GetTotalSupply() {
        try {
            // Get the total supply in circulation/ minted
            const value = await Tokencontract.totalSupply();
            const balance = await Tokencontract.balanceOf(myAddress);
            const user2balance = await Tokencontract.balanceOf(User2);
            // set
            SetTotalSupply(value / (10 ** Decimals));
            SetTokenBalance(balance / (10 ** Decimals));
            SetUser2TokenBalance(user2balance / (10 ** Decimals));
            console.log("CharityAddresses", CharityAddresses);
        } catch (error) {
            alert('Something went wrong, try again.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    //mint token (Owner)
    async function Mint() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            const amount_send = Amount;
            const amnt = ethers.utils.parseEther(amount_send.toString());
            let transaction = await Tokencontract.mint(AddressToMint, amnt);

            SetDialog(transaction);

        } catch (error) {
            alert('Something went wrong with the mint transaction');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //mint token (Selfmint)
    async function SelfMint() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.selfmint();

            SetDialog(transaction);

        } catch (error) {
            alert('Something went wrong with the selfmint transaction');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //whitelistt address
    async function Whitelist() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.addToWhitelist(AddressToWhitelist.toLowerCase(), Amount * 100);

            SetDialog(transaction);
        } catch (error) {
            alert('Something went wrong with the whitelist transaction');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Delete charity from whitelist
    async function Delete() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.deleteFromWhitelist(AddressToRemoveFromWhitelist.toLowerCase());

            SetDialog(transaction);
        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Contract Owner : set Rate
    async function SetCustumRate() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.setRate(AddressToCustomize.toLowerCase(), Amount * 100);

            SetDialog(transaction);
        } catch (error) {
            alert('Something went wrong with the rate customization transaction.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //get whitelistt address rate
    async function GetRate(address) {
        try {
            // const rate = await Tokencontract.whitelistedRate(address);
            // const charity = await Tokencontract.getRecipientAddressOf(myAddress);
            // const customRate = (await Tokencontract.getRateOf(myAddress)/ 100).toString();
            // const defaultrate = (await Tokencontract.whitelistedRate(charity)/ 100).toString();

            const charityInfo = await Tokencontract.charityInfo(address.toLowerCase());
            const rate = (charityInfo.defaultRate / 100).toString();
            const charity = charityInfo.msgRecipient;
            const customRate = (charityInfo.msgRate / 100).toString();
            const defaultrate = (charityInfo.RecipientRate / 100).toString();
            // console.log((rate / 100).toString());
            // console.log("customRate",(customRate/ 100).toString());
            // console.log("defaultrate",(defaultrate/ 100).toString());

            console.log("charityInfo", charityInfo, charityInfo.defaultRate, charityInfo.whitelisted);
            const whitelisted = (charityInfo.whitelisted).toString();
            SetWhitelisted(charityInfo.whitelisted);

            let item = {
                whitelisted: whitelisted,
                address: charity,
                defaultRate: defaultrate,
                rate: customRate,
            }
            SetRate(rate);
            SetCharity(item);
        } catch (error) {
            alert('Something went wrong, try again.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    //activate charity
    async function Activate() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.setRecipient(AddressToActivate.toLowerCase());

            SetDialog(transaction);
        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //activate and customize charity
    async function ActivateCustum() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.setRecipientAddressAndRate(AddressToCustomizeActivate.toLowerCase(), Amount * 100);

            SetDialog(transaction);
        } catch (error) {
            alert(error.message);
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //customize charity
    async function Custum() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.setCustumRate(Amount * 100);

            SetDialog(transaction);
        } catch (error) {
            alert(error.message);
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Deactivate charity
    async function Deactivate() {
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            let transaction = await Tokencontract.deleteRecipient();

            SetDialog(transaction);
        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //before Transfer
    async function beforeTransfer() {
        try {
            const amount_send = Amount;
            const charity = await Tokencontract.getRecipientAddressOf(myAddress.toLowerCase());
            console.log("BT charity", charity);
            const rate = await Tokencontract.getRateOf(charity);
            const balance = await Tokencontract.balanceOf(myAddress.toLowerCase());
            // console.log(rate.toString()/100);
            const total = Number(amount_send) + (amount_send * rate) / 10000;
            const msgBalance = balance / (10 ** Decimals);
            console.log(total + " TST", msgBalance.toString());

            let item = {
                total: total,
                msgBalance: msgBalance,
            }
            console.log(item);

            GetRate(charity);
            SetBeforeTransfer(item);
            setOpenBeforeTransfer(!openBeforeTransfer)

            // return [total, msgBalance]
            // return {
            //     total: total,
            //     msgBalance: msgBalance
            // }
        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    //transfer charity
    async function Transfer() {
        // beforeTransfer();
        // console.log((beforeTransfer()).total);
        setShowSign(true);
        setShowDialog(true);
        setMined(false);
        try {
            const amount_send = Amount;
            const amnt = ethers.utils.parseEther(amount_send.toString());
            let transaction = await Tokencontract.transfer(AddressToSend.toLowerCase(), amnt);

            SetDialog(transaction);

        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);

            RemoveDialog();
        }
    }

    //Get dialog status
    async function SetDialog(transaction) {
        try {
            setShowSign(false);
            await transaction.wait();
            setMined(true);
            setTransactionHash(transaction.hash);
            console.log("Successfull transaction, transaction hash:", transaction.hash);
        } catch (error) {
            alert('Something went wrong.');
            //setErrorMessage(error.message);
            console.log(error);
        }
    }

    async function RemoveDialog() {
        try {
            setShowDialog(false);
            setShowSign(false);
            setMined(false);
            setTransactionHash("");
            console.log("transaction error , or reverted");
        } catch (error) {
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
            <div style={{ textAlign: 'left', padding: '0px 20px 20px 20px' }}>
                {mined && <div>
                    Your purchase has been confirmed and is on the blockchain.<br /><br />
                    <a target="_blank" rel="noopener noreferrer" href={`https://goerli.etherscan.io/tx/${transactionHash}`}>View on Etherscan</a>
                </div>}
                {!mined && !showSign && <div><p>Please wait while we confirm your transaction on the blockchain....</p></div>}
                {!mined && showSign && <div><p>Please sign to confirm your transaction.</p></div>}
            </div>
            <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
                {!mined && <CircularProgress />}
            </div>
            {mined &&
                <button onClick={() => {
                    setShowDialog(false);
                    window.location.reload();
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
        createNetworkData('chain Number', Chain_Number),
        createNetworkData('Wallet Address', myAddress),
    ];

    function createData(name, data) {
        return { name, data };
    }

    const rows = [
        createData('CharityToken contract', Tokencontract.address),
        createData('Contract owner', Owner),
        createData('Token', TokenName),
        createData('User2 Address', User2),
    ];

    const supply_rows = [
        createData('Total Supply', TotalSupply),
        createData('Your token Balance', TokenBalance),
        createData('User2 token Balance', User2TokenBalance),
    ];

    return (
        < div className="App" >
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
                    <h1 sx={{ width: '100%', fontFamily: 'Monospace' }}>A demonstration of the EIP-6353 : Charity</h1>
                    {/*{isToggleOn ? 'ON' : 'OFF'}*/}
                    <ButtonGroup
                        orientation="vertical"
                        aria-label="vertical contained button group"
                        variant="outlined"
                        sx={{ boxShadow: 1, flexShrink: 1 }}
                    >
                        {buttons}
                    </ButtonGroup>
                </Box>
            </div>
            <div>
                {isToggleOn &&
                    <TableContainer component={Paper} elevation={16}
                        sx={{ ":hover": { boxShadow: 6, }, borderRadius: '16px', maxWidth: 460, marginBottom: "20px" }} >
                        <Table sx={{ minWidth: 350, }} aria-label="simple table">
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
                <TableContainer component={Paper} elevation={6} sx={{ ":hover": { boxShadow: 20, }, borderRadius: '16px', maxWidth: 860 }}>
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
                            {CharityAddresses.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        Charity {row.id} Address
                                    </TableCell>
                                    <TableCell align="right">{row.addresses}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <br />
            <div className="Supply">
                <TableContainer component={Paper} elevation={6} sx={{ ":hover": { boxShadow: 16, }, borderRadius: '16px', maxWidth: 460, marginTop: '20px' }}>
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
                            {CharityAddresses.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        Charity {row.id} Balance
                                    </TableCell>
                                    <TableCell align="right">{row.balance}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell align="center" colSpan={2}><Button variant="outlined" color="primary" onClick={GetTotalSupply}>Total Supply</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" colSpan={2}><Button variant="outlined" color="success" onClick={SelfMint}>Self Mint</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <br />
            {/*{isAdmin ? "true" : "false"} */}
            <div className="Actions" style={{ marginTop: '30px'}}>
                <Box
                    component="form"
                    onSubmit={submitForm}
                    noValidate
                    autoComplete="off"
                >
                    {isAdmin &&
                        <List
                            sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Actions (Only contract owner)
                                </ListSubheader>
                            }
                        >
                            <ListItemButton onClick={() => handleClick2(2.0)}>
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
                                        value={AddressToMint || ""}
                                        onChange={(e) => SetAddressToMint(e.target.value)}
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
                            <ListItemButton onClick={() => handleClick2(2.1)}>
                                <ListItemText primary="Whitelist charity address" />
                                {open1 ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open1} timeout="auto" unmountOnExit>
                                <div>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Charity address"
                                        size="small"
                                        value={AddressToWhitelist || ""}
                                        onChange={(e) => SetAddressToWhitelist(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Default rate"
                                        type="number"
                                        size="small"
                                        value={Amount || ""}
                                        onChange={(e) => SetAmount(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Button variant="outlined" color="secondary" size="large" onClick={Whitelist}>Whitelist</Button>
                                </div>
                            </Collapse>
                            <ListItemButton onClick={() => handleClick2(2.2)}>
                                <ListItemText primary="Custom Rate" />
                                {open2 ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open2} timeout="auto" unmountOnExit>
                                <div>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Charity address"
                                        size="small"
                                        value={AddressToCustomize || ""}
                                        onChange={(e) => SetAddressToCustomize(e.target.value)}
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
                            <ListItemButton onClick={() => handleClick2(2.3)}>
                                <ListItemText primary="Remove charity address from Whitelist " />
                                {open3 ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                <div>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Charity address"
                                        size="small"
                                        value={AddressToRemoveFromWhitelist || ""}
                                        onChange={(e) => SetAddressToRemoveFromWhitelist(e.target.value)}
                                    />
                                    <Button variant="outlined" color="error" size="large" onClick={Delete}>Delete</Button>
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
                        <ListItemButton onClick={handleClick1}>
                            <ListItemText primary="Charity info" />
                            {openInfo ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openInfo} timeout="auto" unmountOnExit>
                            <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Charity address"
                                    size="small"
                                    value={AddressToGetinfo || ""}
                                    onChange={(e) => SetAddressToGetinfo(e.target.value)}
                                />
                                <Button variant="outlined" color="secondary" size="large" onClick={() => GetRate(AddressToGetinfo)}>Get Info</Button>
                                <Divider>INFO</Divider>
                                <Box sx={{ m: 2 }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                {Whitelisted ? <Chip color="success" label={`Whitelisted: ${Charity.whitelisted}`}/> : <Chip color="primary" label={`Whitelisted: ${Charity.whitelisted}`}/>}
                                                <Chip label={`Default rate: ${Rate}%`} />
                                            </Stack>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Chip sx={{  width: '100%' }} label={`User registered Recipient address:  ${Charity.address}`} />
                                            </Stack>
                                            <Stack direction="column" spacing={1} justifyContent="center">
                                                <Chip sx={{  width: '100%' }} color = "warning" label={`Recipient custum rate :  ${Charity.rate}%`} />
                                                <Chip sx={{  width: '100%' }} label={`Recipient default rate:  ${Charity.defaultRate}%`} />
                                            </Stack>
                                        </Box>
                                {/* <p> Whitelisted/Default rate: {Charity.whitelisted} / {Rate} %</p>
                                <p> User registered Recipient address: {Charity.address}</p>
                                <p> Recipient custum rate : {Charity.rate} %</p>
                                <p> Recipient default rate: {Charity.defaultRate} %</p> */}
                            </div>
                        </Collapse>
                        <ListItemButton onClick={() => handleClick3(3.0)}>
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
                                    value={AddressToActivate || ""}
                                    onChange={(e) => SetAddressToActivate(e.target.value)}
                                />
                                <Button variant="outlined" color="secondary" size="large" onClick={Activate}>Activate</Button>
                            </div>
                        </Collapse>
                        <ListItemButton onClick={() => handleClick3(3.1)}>
                            <ListItemText primary="Customize + Activate" />
                            {openDefault1 ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDefault1} timeout="auto" unmountOnExit>
                            <div>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Charity address"
                                    size="small"
                                    value={AddressToCustomizeActivate || ""}
                                    onChange={(e) => SetAddressToCustomizeActivate(e.target.value)}
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
                        <ListItemButton onClick={() => handleClick3(3.2)}>
                            <ListItemText primary="Customize" />
                            {openDefault2 ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDefault2} timeout="auto" unmountOnExit>
                            <div>
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
                                <Button variant="outlined" color="secondary" size="large" onClick={Custum}>Customize</Button>
                            </div>
                        </Collapse>
                        <ListItemButton onClick={() => handleClick3(3.3)}>
                            <ListItemText primary="Transfer" />
                            {openTransfer ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openTransfer} timeout="auto" unmountOnExit>
                            <div>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Address to send"
                                    size="small"
                                    value={AddressToSend || ""}
                                    onChange={(e) => SetAddressToSend(e.target.value)}
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
                                <Button variant="outlined" color="primary" size="medium" onClick={beforeTransfer}>View transaction details</Button>
                                <Collapse in={openBeforeTransfer} timeout="auto" unmountOnExit>
                                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        <Box sx={{ my: 3, mx: 2 }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs>
                                                    <Typography gutterBottom variant="h4" component="div">
                                                        Transaction Preview
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {beforeTransferView.total} {TokenSymbol}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Typography color="text.secondary" variant="body2">
                                                The price is the sum of the transfer with the additinal donation fee.
                                            </Typography>
                                        </Box>
                                        <Divider variant="middle" />
                                        <Box sx={{ m: 2 }}>
                                            <Typography gutterBottom variant="body1">
                                                Charity Info
                                            </Typography>
                                            <Stack direction="column" spacing={1} justifyContent="center">
                                                <Chip label={`Token Balance: ${beforeTransferView.msgBalance}`} />
                                                <Chip color="primary" label={`Recipient:  ${Charity.address}`} />
                                                <Chip label={`rate :  ${Charity.rate}%`} />
                                            </Stack>
                                        </Box>
                                        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                                            <Button variant="outlined" color="secondary" size="large" onClick={Transfer}>Transfer</Button>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </div>
                        </Collapse>
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

