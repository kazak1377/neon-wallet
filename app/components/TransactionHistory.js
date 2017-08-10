import React, { Component } from 'react';
import { connect } from 'react-redux';
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from 'electron';
import Copy from 'react-icons/lib/md/content-copy';
import { clipboard } from 'electron';

// TODO: make this a user setting
const getExplorerLink = (net, txid) => {
  let base;
  if (net === "MainNet"){
    base = "http://antcha.in";
  } else {
    base = "http://testnet.antcha.in";
  }
  return base + "/tx/hash/" + txid;
}

// helper to open an external web link
const openExplorer = (srcLink) => {
  shell.openExternal(srcLink);
}

class TransactionHistory extends Component {

  componentDidMount = () => {
    syncTransactionHistory(this.props.dispatch, this.props.net, this.props.address);
  }

  render = () =>
    <div id="transactionInfo">
      <div className="columnHeader">Transaction History</div>
      <div className="headerSpacer"></div>
      <ul id="transactionList">
        {this.props.transactions.map((t) => {
          const formatGas = (gas) => Math.floor(parseFloat(gas) * 10000) / 10000;
          let formatAmount = t.type === "NEO" ? parseInt(t.amount) : formatGas(t.amount);
          return (<li>
              <div className="txid" onClick={() => openExplorer(getExplorerLink(this.props.net, t.txid))}>
                {t.txid.substring(0,32)}</div><div className="amount">{formatAmount} {t.type}
              </div></li>);
        })}
      </ul>
    </div>;
}

const mapStateToProps = (state) => ({
  address: state.account.address,
  net: state.metadata.network,
  transactions: state.wallet.transactions
});

TransactionHistory = connect(mapStateToProps)(TransactionHistory);

export default TransactionHistory;
