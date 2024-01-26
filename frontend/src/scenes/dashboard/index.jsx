import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactionsPositive, mockTransactionsNegative } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import { ThumbUp, VideoLibrary, Visibility } from "@mui/icons-material";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [totalViews, setTotalViews] = useState("fetching...");
  const [totalLikes, setTotalLikes] = useState("fetching...");
  const [totalVideos, setTotalVideos] = useState("fetching...");


  useEffect(() => {
    fetch('http://127.0.0.1:5000')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(dataNew => {
        console.log(dataNew);
        setTotalLikes(dataNew["likeCounter"]);
        setTotalViews(dataNew["viewCounter"]);
        setTotalVideos(dataNew["videoCounter"]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
    console.log('Component rendered');
  }, []);

  console.log('Outer Component rendered');


  const sortedTransactionsPositive = [...mockTransactionsPositive].sort((a, b) => {
    // Use parseFloat to convert percentage strings to numbers for proper comparison
    const percentageA = parseFloat(a.percentage);
    const percentageB = parseFloat(b.percentage);

    // Sort in decreasing order (largest percentage first)
    return percentageB - percentageA;
  });

  const sortedTransactionsNegative = [...mockTransactionsNegative].sort((a, b) => {
    // Use parseFloat to convert percentage strings to numbers for proper comparison
    const percentageA = parseFloat(a.percentage);
    const percentageB = parseFloat(b.percentage);

    // Sort in decreasing order (largest percentage first)
    return percentageB - percentageA;
  });

  return (
    <Box m="40px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Cyber Ciphers" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalViews}
            subtitle="Total Views"
            progress="0.75"
            increase="+14%"
            icon={
              <Visibility
                sx={{ color: colors.black, fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalLikes}
            subtitle="Total Likes"
            progress="0.50"
            increase="+21%"
            icon={
              <ThumbUp
                sx={{ color: colors.black, fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.white}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalVideos}
            subtitle="Total Videos"
            progress="0.30"
            increase="+5%"
            icon={
              <VideoLibrary
                sx={{ color: colors.black, fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            borderRadius="8px"
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Product Trends Overtime
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 2"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            backgroundColor={colors.redAccent[400]}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.greenAccent[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.white} variant="h5" fontWeight="600">
              Positive
            </Typography>
          </Box>
          {sortedTransactionsPositive.map((transaction, i) => (
            <Box
            
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
      
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="70%"
                  fontWeight="600"
                >
                  {transaction.tag}
                </Typography>
              </Box>
              <Box
                fontSize="1.15rem"
                p="5px 10px"
                color={"black"}
                fontWeight="600"
                borderRadius="4px"
              >
                {transaction.percentage}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 2"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            
            backgroundColor={colors.blueAccent[400]}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.greenAccent[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Negative
            </Typography>
          </Box>
          {sortedTransactionsNegative.map((transaction, i) => (
            <Box

              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="15px"
            >
              <Box>
      
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="70%"
                  fontWeight="600"
                >
                  {transaction.tag}
                </Typography>
              </Box>
              <Box
                color={"black"}
                fontWeight="600"
                fontSize="1.15rem"
                width="50px"
                padding="5px 10px"
                margin="5px"
                borderRadius="4px"
              >
                {transaction.percentage}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.white}
        >
          <Typography
            variant="h5"
            color={colors.black}
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Platform-wise Sentiment Distribution 
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box> 
          <Box
            boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
            borderRadius="8px"
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.white}
            padding="30px"
          >
          <Typography
            variant="h5"
            color={colors.black}
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
            >
            Geography Based Traffic
          </Typography>
          <Box height="220px">
            <PieChart isDashboard={true} />
          </Box>
        </Box>
        {/* ROW 4 */}
        <Box
      boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
      borderRadius="8px"
      gridColumn="span 12"
      gridRow="span 2"
      height="150px"
      backgroundColor={colors.white}
      padding="30px"
    >
      <Typography
        variant="h5"
        color={colors.black}
        fontWeight="600"
        sx={{ marginBottom: "15px" }}
      >
        Table For Sentiment Analysis
      </Typography>
      <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                Comments
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                Like Count
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                Reply Count
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                Sentiment Average Score
                  {/* {transaction.tag} */}
                </Typography>
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 2
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 3
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
        </Box>
        <Box
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 4
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  overflow-x-hidden="true"
                  width="25%"
                  fontWeight="600"
                >
                HELLO 1
                  {/* {transaction.tag} */}
                </Typography>
        </Box>
    </Box>
      </Box>
    // </Box>
  );
};

export default Dashboard;
