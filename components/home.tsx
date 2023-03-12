import React from 'react';
import Chat from './chat';
import Sidebar from './sidebar';
import Style from '../styles/home.module.scss';

const Home = () => {
	return (
		<div className={`grid place-items-center bg-slate-900 min-h-screen`}>
			<div className={`${Style.app__body} flex`}>
				<Sidebar />
			</div>
		</div>
	);
}
export default Home;