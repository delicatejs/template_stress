import React from 'react'

export default ({ num = 100}) => {
	const liE = []
	for (let i = 0; i < num; i++) { 
		liE.push(<li key={i}>123</li>)
	}	
	return (
		<ul>
			{liE}
		</ul>
	)
}