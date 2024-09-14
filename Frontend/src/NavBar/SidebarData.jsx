import React from 'react';
// import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
// import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
  
    {
        title: 'Receipt Uploader',
        path: '/ReceiptUploader',
        icon: <AiIcons.AiFillPicture  />,
        cName: 'nav-text'
    },
  
    {
        title: 'Charges Table',
        path: '/ChargesTable',
        icon: <AiIcons.AiOutlineTable  />,
        cName: 'nav-text'
    },

    {
        title: 'Data Visualizer',
        path: '/DataVisualizer',
        icon: <AiIcons.AiFillPieChart />,
        cName: 'nav-text'
    },
// enter ur page routes here with titles and icons for it to display on nav bar
// https://react-icons.github.io/react-icons/icons/fa/ in case need to change icons
  
]