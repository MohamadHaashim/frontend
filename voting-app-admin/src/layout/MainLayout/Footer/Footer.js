import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const Footer = () => {
  const theme = useTheme();

  return (
      <Box
          sx={{
              width: '100%',
              padding: '10px 0',
              backgroundColor: theme.palette.background.paper,
              // borderTop: '1px solid #ccc',
              textAlign: 'center',
              // marginBottom: -2.5
          }}
      >
          <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Powered by HERMON Solutions.
          </Typography>
      </Box>
  );
};

export default Footer;
