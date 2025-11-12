import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    IconAtom,
    IconBasket,
    IconBellRinging,
    IconBorderAll,
    IconBorderRadius,
    IconBoxMultiple,
    IconBrandChrome,
    IconBrandGravatar,
    IconBrush,
    IconBug,
    IconCalendar,
    IconChartArcs,
    IconChartCandle,
    IconChartInfographic,
    IconCircle,
    IconCircleOff,
    IconClipboardList,
    IconDashboard,
    IconDeviceAnalytics,
    IconFiles,
    IconForms,
    IconHelp,
    IconId,
    IconKey,
    IconLayoutList,
    IconLoader,
    IconLockAccess,
    IconMail,
    IconMenu,
    IconMessages,
    IconNfc,
    IconPalette,
    IconPencil,
    IconPhoneCall,
    IconPictureInPicture,
    IconReceipt2,
    IconRun,
    IconShadow,
    IconShape,
    IconShieldLock,
    IconSitemap,
    IconTools,
    IconTypography,
    IconUser,
    IconUserCheck,
    IconCategory,
    IconBrandTabler,
    IconSettings2,
    IconUserPlus,
    IconCalendarEvent
} from '@tabler/icons';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,

    IconChartArcs: IconChartArcs,
    IconClipboardList: IconClipboardList,
    IconChartInfographic: IconChartInfographic,

    IconForms: IconForms,
    IconReceipt2: IconReceipt2,
    IconPencil: IconPencil,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconPhoneCall: IconPhoneCall,
    IconBrandChrome: IconBrandChrome,
    IconFiles: IconFiles,
    IconAtom: IconAtom,
    IconTools: IconTools,
    IconBrush: IconBrush,
    IconLockAccess: IconLockAccess,
    IconShieldLock: IconShieldLock,
    IconKey: IconKey,
    IconTypography: IconTypography,
    IconMenu: IconMenu,
    IconBoxMultiple: IconBoxMultiple,
    IconCircleOff: IconCircleOff,
    IconCircle: IconCircle,
    IconBorderRadius: IconBorderRadius,
    IconBrandGravatar: IconBrandGravatar,
    IconShape: IconShape,
    IconUserCheck: IconUserCheck,
    IconId: IconId,
    IconLayoutList: IconLayoutList,
    IconBug: IconBug,
    IconLoader: IconLoader,
    IconRun: IconRun,
    IconUser: IconUser,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    IconPictureInPicture: IconPictureInPicture,
    IconMail: IconMail,
    IconMessages: IconMessages,
    IconNfc: IconNfc,
    IconCalendar: IconCalendar,
    IconBellRinging: IconBellRinging,
    IconBorderAll: IconBorderAll,
    IconChartCandle: IconChartCandle,
    IconBasket: IconBasket,
    IconCategory: IconCategory,
    IconBrandTabler: IconBrandTabler,
    IconSettings2: IconSettings2,
    IconUserPlus: IconUserPlus,
    IconCalendarEvent: IconCalendarEvent
};

const menuItems = {
    items: [
        // {
        //     id: 'dashboard',
        //     // title: <FormattedMessage id="dashboard" />,
        //     type: 'group',
        //     children: [
        //         {
        //             id: 'dash-default',
        //             title: <FormattedMessage id="default" />,
        //             type: 'item',
        //             url: '/dashboard/default',
        //             icon: icons['IconDashboard'],
        //             breadcrumbs: false
        //         }
        //     ]
        // },

        {
            id: 'pages',
            // title: <FormattedMessage id="pages" />,
            caption: <FormattedMessage id="pages-caption" />,
            type: 'group',
            children: [




            ]
        },
        {
            id: 'utilities',
            // title: <FormattedMessage id="utilities" />,
            type: 'group',
            children: [
                {
                    id: 'dashboard',
                    title: <FormattedMessage id="Dashboard" />,
                    type: 'item',
                    url: '/dashboard',
                    icon: icons['IconBrandTabler'],
                    breadcrumbs: false
                }
                ,
                {
                    id: 'events',
                    title: <FormattedMessage id="Events Management" />,
                    type: 'item',
                    url: '/events',
                    icon: icons['IconCalendarEvent']
                },
                {
                    id: 'category',
                    title: <FormattedMessage id="Category Management" />,
                    type: 'item',
                    url: '/category',
                    icon: icons['IconCategory']
                },
                {
                    id: 'nominees',
                    title: <FormattedMessage id="Nominees Management" />,
                    type: 'item',
                    url: '/nominees',
                    icon: icons['IconUserPlus']
                },
                {
                    id: 'votings',
                    title: <FormattedMessage id="Votings" />,
                    type: 'item',
                    url: '/votings',
                    icon: icons['IconShadow']
                },
                // {
                //     id: 'authentication',
                //     title: <FormattedMessage id="authentication" />,
                //     type: 'collapse',
                //     icon: icons['IconSettings2'],
                //     children: [

                //         {
                //             id: 'login3',
                //             title: <FormattedMessage id="login" />,
                //             type: 'item',
                //             url: '/pages/login/login3',
                //             target: true
                //         },
                //         {
                //             id: 'register3',
                //             title: <FormattedMessage id="register" />,
                //             type: 'item',
                //             url: '/pages/register/register3',
                //             target: true
                //         }

                //     ]
                // },
                // {
                //     id: 'icons',
                //     title: <FormattedMessage id="icons" />,
                //     type: 'collapse',
                //     icon: icons['IconPencil'],
                //     children: [
                //         {
                //             id: 'util-tabler-icons',
                //             title: <FormattedMessage id="tabler-icons" />,
                //             type: 'item',
                //             url: '/icons/tabler-icons'
                //         },
                //         {
                //             id: 'util-material-icons',
                //             title: <FormattedMessage id="material-icons" />,
                //             type: 'item',
                //             url: '/icons/material-icons'
                //         }
                //     ]
                // }
            ]
        },
        {
            id: 'settings',
            type: 'group',
            children: [
                {
                    id: 'settings',
                    title: <FormattedMessage id="Settings" />,
                    type: 'item',
                    url: '/settings',
                    icon: icons['IconSettings2']
                },
                // {
                //     id: 'documentation',
                //     title: <FormattedMessage id="documentation" />,
                //     type: 'item',
                //     url: '#',
                //     icon: icons['IconHelp'],
                //     target: true,
                //     external: true
                // }
            ]
        }
    ]
};

export default menuItems;
