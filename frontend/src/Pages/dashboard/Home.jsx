import React from 'react'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
       from 'recharts';
import CoinsCard from './CoinsCard'
import LeaderboardCard from './LeaderboardCard';
import PhishingReportCard from './PhishingReportCard';
import UserSettingsCard from './UserSettingsCard'
import SecurityRecommendationsCard from './SecurityRecommendationsCard';
import ScanHistory from './ScanHistory';

function Home() {
// Assuming 'reports' is an array of report objects

  const reports = [
  { date: '2023-10-01', status: 'Pending', outcome: 'In review' },
  { date: '2023-09-25', status: 'Closed', outcome: 'No threat detected' },
  { date: '2023-09-20', status: 'Open', outcome: 'Under investigation' },
  // Add more reports as needed
       ];
       const recommendations = ['Enable two-factor authentication', 'Update your passwords', 'Install antivirus software'];


const coins = 100;
const leaderboard = [
  { name: 'John Doe', submitted: 15 },
  { name: 'Alice Smith', submitted: 12 },
  { name: 'Bob Johnson', submitted: 10 },
  // Add more leaderboard entries as needed
];

const settings = {
  name: 'Your Name',
  email: 'your.email@example.com',
  isPremium: true,
  // Add more settings as needed
};

   const data = [
  { date: '2023-03-01', status: 'Processed', outcome: 'Phishing' },
  { date: '2023-03-01', status: 'Processed', outcome: 'Phishing' },
  { date: '2023-03-02', status: 'Pending', outcome: 'Suspicious' },
  { date: '2023-03-03', status: 'Processed', outcome: 'Safe' },
  { date: '2023-03-03', status: 'Processed', outcome: 'Phishing' },
  { date: '2023-03-04', status: 'Processed', outcome: 'Phishing' },
  { date: '2023-03-05', status: 'Pending', outcome: 'Suspicious' },
  // Add more entries as needed
];

const phishingCountsPerDate = data.reduce((acc, entry) => {
  const date = entry.date;
  if (entry.outcome === 'Phishing') {
    acc[date] = (acc[date] || 0) + 1;
  }
  return acc;
}, {});

const phishingChartData = Object.entries(phishingCountsPerDate).map(([date, count]) => ({ date, count }));


  return (
    <main className='main-container'>
        <div className='main-title'>
           
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                     <SecurityRecommendationsCard recommendations={recommendations} />
                    <BsFillArchiveFill className='card_icon'/>
                </div>
               
            </div>
            <div className='card'>
                <div className='card-inner'>
                   <CoinsCard coins={coins} />
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <LeaderboardCard leaderboard={leaderboard} />
                    <BsPeopleFill className='card_icon'/>
                </div>
               
            </div>
            <div className='card'>
                <div className='card-inner'>
                   <UserSettingsCard settings={settings} />
                    <BsFillBellFill className='card_icon'/>
                </div>
            </div>
        </div>

        <div className='charts'>


     <ResponsiveContainer width='100%' height='100%'>
  <LineChart
    width={500}
    height={300}
    data={phishingChartData}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray='3 3' />
    <XAxis dataKey='date' />
    <YAxis
      label={{ value: 'Phishing Count', angle: -90, position: 'insideLeft' }}
      domain={[0, 'auto']}
      allowDecimals={false} // Ensure whole numbers only
      tickCount={5}
      tickFormatter={(value) => `${value}`}
    />
    <Tooltip />
    <Legend />
    <Line type='monotone' dataKey='count' stroke='#8884d8' activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>
<ScanHistory/>


        </div>
    </main>
  )
}

export default Home;