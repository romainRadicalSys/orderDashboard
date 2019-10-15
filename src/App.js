import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Moment from 'react-moment';
import Axios from 'axios';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalBarSeries } from 'react-vis';

import './App.css';

const OrdersList = () => {
	//Set States

	const [sOrders, setsOrders] = useState([]); //sOrders
	const [pOrders, setpOrders] = useState([]); //pOrders
	const [invoice, setinvoices] = useState([]); //Invoices
	const [openOrder, setopenOrder] = useState(0); //Open Orders for sOrders
	const [closeOrder, setCloseOrder] = useState(0); //Close Orders for sOrders
	const [openpOrder, setopenpOrder] = useState(0); //Open Orders for pOrders
	const [closepOrder, setClosepOrder] = useState(0); //Close Orders for pOrders
	const [openInvoices, setopenInvoices] = useState(0); //Open Orders for Invoices
	const [closeInvoice, setCloseInvoices] = useState(0); //Close Orders for Invoices

	Axios.get('./mocks/orders.json')
		.then(res => {
			const sOrder = res.data.orders.sOrders.data;
			const pOrder = res.data.orders.pOrders.data;
			const invoices = res.data.orders.invoices.data;
			//sOrders data
			setsOrders(sOrder);
			//pOrders data
			setpOrders(pOrder);
			//invoices data
			setinvoices(invoices);

			//Counting sOrder Open/close
			setopenOrder(sOrders.filter(obj => obj.openFlag === 'F').length);
			setCloseOrder(sOrders.filter(obj => obj.openFlag === 'T').length);

			//Counting pOrder Open/close
			setopenpOrder(pOrders.filter(obj => obj.openFlag === 'F').length);
			setClosepOrder(pOrders.filter(obj => obj.openFlag === 'T').length);

			//Counting invoices Open/close
			setopenInvoices(invoice.filter(obj => obj.openFlag === 'F').length);
			setCloseInvoices(invoice.filter(obj => obj.openFlag === 'T').length);
		})
		.catch(err => {
			console.log(err);
		});

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
			accessor: 'companyRefNumber', // String-based value accessors!
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

	const dataGraphOrders = [{ x: 'Open Orders', y: openOrder }, { x: 'Closed Orders', y: closeOrder }];
	const dataGraphOrderp = [{ x: 'Open Orders', y: openpOrder }, { x: 'Closed Orders', y: closepOrder }];
	const dataGraphInvoices = [{ x: 'Open Orders', y: openInvoices }, { x: 'Closed Orders', y: closeInvoice }];

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
					<ReactTable data={sOrders} columns={columns} filterable />
				</TabPanel>
				<TabPanel>
					<ReactTable data={pOrders} columns={columns} filterable />
				</TabPanel>
				<TabPanel>
					<ReactTable data={invoice} columns={columns} filterable />
				</TabPanel>
				<TabPanel>
					<p>Open:{openpOrder}</p>
					<p>Close: {closepOrder}</p>
					<XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis tickLabelAngle={-45} />
						<YAxis />
						<VerticalBarSeries data={dataGraphOrders} />
					</XYPlot>
					<XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis tickLabelAngle={-45} />
						<YAxis />
						<VerticalBarSeries data={dataGraphOrderp} />
					</XYPlot>
					<XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis tickLabelAngle={-45} />
						<YAxis />
						<VerticalBarSeries data={dataGraphInvoices} />
					</XYPlot>
				</TabPanel>
			</Tabs>
		</div>
	);
};

function App() {
	return (
		<div className="App">
			<OrdersList />
		</div>
	);
}

export default App;
