import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Orders from './mocks/orders.json';
import Moment from 'react-moment';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalBarSeries } from 'react-vis';
import './App.css';


// Component to diplay Open/Closed order
const Chart = (props) => {
	return (
		<div className='order-graphWrapper'>
			<h1>{props.name}</h1>
			<XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis tickLabelAngle={-45} />
				<YAxis />
				<VerticalBarSeries data={props.data} />
			</XYPlot>
		</div>
	)
}


// Component to diplay table with orders data
// I've used ReactTable library for the table diplay
const OrderTable = (props) => {
	const columns = [
		{
			Header: 'Sales Order',
			accessor: 'soNumber',
			sortable: true,
			filterable: true,
			showPagination: true,
			pageSizeOptions: [5, 10, 20, 25, 50, 100],
			defaultPageSize: 10,
			resizable: true
		},
		{
			Header: 'Date',
			accessor: 'dateCreated',
			sortable: true,
			filterable: false,
			Cell: props => (
				<span className="number">
					{' '}
					<Moment format="DD/MM/YYYY">{props.value}</Moment>
				</span>
			)
		},
		{
			Header: 'Po Ref',
			accessor: 'companyRefNumber',
			sortable: true,
			filterable: false
		},
		{
			Header: 'Line item',
			accessor: 'itemNumber',
			sortable: true,
			filterable: false
		},
		{
			Header: 'Ship To',
			accessor: 'shipAddress1',
			filterable: false
		},
		{
			Header: 'Customer',
			accessor: 'companyName',
			sortable: true,
			filterable: false
		},
		{
			Header: 'Part Number',
			accessor: 'pnUpper',
			sortable: true,
			filterable: true
		}
	];

	return (
		<ReactTable data={props.orders} columns={columns} filterable />
	)
}


// Main Component used to displays the Dashboard components Tables and Graphs 
// I've used Tab to seperates the different sections
// The library react-tabs is used to display the tabs sections
const OrdersData = () => {

	const sOrders = Orders.orders.sOrders.data; //sOrders
	const pOrders = Orders.orders.pOrders.data; //pOrders
	const invoice = Orders.orders.invoices.data; //Invoices

	//Counting sOrder Open/close
	const openOrder = sOrders.filter(obj => obj.openFlag === 'F').length;
	const closeOrder = sOrders.filter(obj => obj.openFlag === 'T').length;

	//Counting pOrder Open/close
	const openpOrder = pOrders.filter(obj => obj.openFlag === 'F').length;
	const closepOrder = pOrders.filter(obj => obj.openFlag === 'T').length;

	//Counting invoices Open/close
	const openInvoices = invoice.filter(obj => obj.openFlag === 'F').length; //Open Orders for Invoices
	const closeInvoice = invoice.filter(obj => obj.openFlag === 'T').length; //Close Orders for Invoices

	//Graph Data
	const dataGraphOrders = {
		sOrders: [{ x: 'Open Orders', y: openOrder }, { x: 'Closed Orders', y: closeOrder }],
		pOrders: [{ x: 'Open Orders', y: openpOrder }, { x: 'Closed Orders', y: closepOrder }],
		invoices: [{ x: 'Open Orders', y: openInvoices }, { x: 'Closed Orders', y: closeInvoice }]
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<Tabs>
				<TabList>
					<Tab>sOrders</Tab>
					<Tab>pOrders</Tab>
					<Tab>Invoices</Tab>
					<Tab>Charts</Tab>
				</TabList>

				<TabPanel>
					<OrderTable orders={sOrders} />
				</TabPanel>
				<TabPanel>
					<OrderTable orders={pOrders} />
				</TabPanel>
				<TabPanel>
					<OrderTable orders={invoice} />
				</TabPanel>
				<TabPanel>
					<div className='orders-graphs'>
						<Chart data={dataGraphOrders.sOrders} name='Open/Close sOrders' />
						<Chart data={dataGraphOrders.pOrders} name='Open/Close pOrders' />
						<Chart data={dataGraphOrders.invoices} name='Open/Close Invoices' />
					</div>
				</TabPanel>
			</Tabs>
		</div>
	);
};

function App() {
	return (
		<div className="App">
			<OrdersData />
		</div>
	);
}

export default App;
