import Link from 'next/link';
import React from 'react';

const SidebarChat = ({ id, name, message }: { id: string, name: string, message: string }) => {
	return (
		<Link href={`/app/rooms/${id}`}>
			<div className={`flex px-2 py-5 hover:bg-[#ebebeb] cursor-pointer`} style={{ borderBottom: '1px solid #ebebeb' }}>
				<div className={`w-12`}>
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" />
				</div>
				<div className='ml-2'>
					<h2 className=''>{name}</h2>
					<p className='text-xs'>{message}</p>
				</div>
			</div>
		</Link>
	);
}
export default SidebarChat;