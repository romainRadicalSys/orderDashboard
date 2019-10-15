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

const SalesList = () => {
	const [sOrders, setsOrders] = useState([]);
	const [pOrders, setpOrders] = useState([]);
	const [invoices, setinvoices] = useState([]);
	const [openOrder, setopenOrder] = useState(0);
	const [closeOrder, setCloseOrder] = useState(0);

	Axios.get('./mocks/orders.json')
		.then(res => {
			const sOrder = res.data.orders.sOrders.data;
			const pOrder = res.data.orders.pOrders.data;
			const invoices = res.data.orders.pOrders.data;
			//sOrders data
			setsOrders(sOrder);
			//pOrders data
			setpOrders(pOrder);
			//invoices data
			setinvoices(invoices);

			setopenOrder(sOrders.filter(obj => obj.openFlag === 'F').length);
			setCloseOrder(sOrders.filter(obj => obj.openFlag === 'T').length);
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

	const dataGraph = [{ x: 'Open Orders', y: openOrder }, { x: 'Closed Orders', y: closeOrder }];

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
					<ReactTable data={invoices} columns={columns} filterable />
				</TabPanel>
				<TabPanel>
					<p>Open:{openOrder}</p>
					<p>Close: {closeOrder}</p>
					<XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis tickLabelAngle={-45} />
						<YAxis />
						<VerticalBarSeries data={dataGraph} />
					</XYPlot>
				</TabPanel>
			</Tabs>
		</div>
	);
};

function App() {
	return (
		<div className="App">
			<SalesList />
		</div>
	);
}

export default App;
