// import React from 'react';
// import { CartesianChart, Bar } from 'victory-native';

// interface BarChartProps {
//     BarData: [];
// }

// const BarChart = ({ BarData }: BarChartProps) => {

//     return (
//         <CartesianChart data={BarData} xKey='x' yKeys={['y']}>
//             {({ points, chartBounds }) => (
//                 //👇 pass a PointsArray to the Bar component, as well as options.
//                 <Bar
//                     points={points.y}
//                     chartBounds={chartBounds}
//                     color='red'
//                     roundedCorners={{ topLeft: 10, topRight: 10 }}
//                 />
//             )}
//         </CartesianChart>
//     );
// };

// export default BarChart;