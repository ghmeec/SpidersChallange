import React from 'react';
import Sidebar from './sidebar';

const Home = () => {
	return (
		<div className={`grid place-items-center bg-[#ececec] min-h-screen `}>
            <div className={`h-[100vh] w-[100vw] overflow-hidden flex`}>
				<Sidebar />
			</div>
		</div>
	);
}
export default Home;