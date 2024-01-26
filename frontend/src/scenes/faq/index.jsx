import { Box, Button, useTheme, TextField } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const customAccordionStyle = {
    color: 'black',
  };
  
  return (
    <Box m="20px">
      <Header title="Feedback" subtitle="Respond to feedback." />

      <Accordion defaultExpanded 
        sx={{ 
          borderRadius: '5px',
          backgroundColor: 'white'
          }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.black} variant="h5">
          What is your favorite piece of tech or gadget that you've reviewed or discussed on your channel? Why do you love it?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            style={{ width: '100%' }}
            id="standard-multiline-static"
            label="Enter your response below..."
            multiline
            rows={4}
            // placeholder="Enter your feedback here..."
            variant="standard"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
          />
          <Box
            mt={"20px"}
            >
            <Button 
              style={{
                backgroundColor: `${colors.blueAccent[100]}`,
                fontWeight: '800',

              }} 
              variant="contained">Reply</Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded 
        sx={{ 
          borderRadius: '5px',
          backgroundColor: 'white'
          }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.black} variant="h5">
          Tech trends are constantly evolving. How do you stay up-to-date with the latest developments in the tech world?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            style={{ width: '100%' }}
            id="standard-multiline-static"
            label="Enter your response below..."
            multiline
            rows={4}
            // placeholder="Enter your feedback here..."
            variant="standard"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
          />
          <Box
            mt={"20px"}
            >
            <Button 
              style={{
                backgroundColor: `${colors.blueAccent[100]}`,
                fontWeight: '800',

              }} 
              variant="contained">Reply</Button>
          </Box>
          
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded 
        sx={{ 
          borderRadius: '5px',
          backgroundColor: 'white'
          }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.black} variant="h5">
          What do you think is the next big thing in the tech industry? Any predictions or trends you're excited about?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            style={{ width: '100%' }}
            id="standard-multiline-static"
            label="Enter your response below..."
            multiline
            rows={4}
            // placeholder="Enter your feedback here..."
            variant="standard"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
          />
          <Box
            mt={"20px"}
            >
            <Button 
              style={{
                backgroundColor: `${colors.blueAccent[100]}`,
                fontWeight: '800',

              }} 
              variant="contained">Reply</Button>
          </Box>
          
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded 
        sx={{ 
          borderRadius: '5px',
          backgroundColor: 'white'
          }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.black} variant="h5">
          Your YouTube channel has grown significantly. How do you engage with your audience and build a community around your content?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            style={{ width: '100%' }}
            id="standard-multiline-static"
            label="Enter your response below..."
            multiline
            rows={4}
            // placeholder="Enter your feedback here..."
            variant="standard"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
          />
          <Box
            mt={"20px"}
            >
            <Button 
              style={{
                backgroundColor: `${colors.blueAccent[100]}`,
                fontWeight: '800',

              }} 
              variant="contained">Reply</Button>
          </Box>
          
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded 
        sx={{ 
          borderRadius: '5px',
          backgroundColor: 'white'
          }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.black} variant="h5">
          Can you share your thoughts on the impact of artificial intelligence on various industries? How do you see AI evolving in the coming years?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            style={{ width: '100%' }}
            id="standard-multiline-static"
            label="Enter your response below..."
            multiline
            rows={4}
            // placeholder="Enter your feedback here..."
            variant="standard"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
          />
          <Box
            mt={"20px"}
            >
            <Button 
              style={{
                backgroundColor: `${colors.blueAccent[100]}`,
                fontWeight: '800',

              }} 
              variant="contained">Reply</Button>
          </Box>
          
        </AccordionDetails>
      </Accordion>
      
    </Box>
  );
};

export default FAQ;
