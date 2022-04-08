import LeftMenu from '../components/menu/LeftMenu/LeftMenu';
import TopMenu from '../components/menu/TopMenu/TopMenu';

import logo from '../public/kuva_logo.png';
import styled from 'styled-components';

/* TOASTS */
import { ToastContainer } from 'react-toastify';

import Image from 'next/image';

export default function MainLayout(props: any) {
 const { identifier } = props.match ? props.match.params : '';
 return (
  <>
   <ToastContainer position='bottom-right' />
   <div id='portal'></div>
   <TopMenu />
   <LeftMenu items={props.menuContent} projectId={identifier} />
   <LogoWrapper>
    <Image
     src={logo}
     alt='logo'
     // style={{
     //   width: 150,
     //   height: 150,
     //   objectFit: "cover"
     // }}
    />
   </LogoWrapper>
   <ContentWrapper>{props.children}</ContentWrapper>
  </>
 );
}

const ContentWrapper = styled.div`
 position: fixed;
 overflow-x: scroll;
 overflow-y: scroll;
 top: 60px;
 right: 0;
 left: 100px;
 bottom: 0;
 padding: 50px 0 50px 50px;
 border-top-left-radius: 50px;
 -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
 box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
 background-color: #f8f9ff;
 overflow-x: scroll;
 /* Hide scrollbar for IE, Edge and Firefox */
 -ms-overflow-style: none;
 scrollbar-width: none;
 /* Hide scrollbar for Chrome, Safari and Opera */
 ::-webkit-scrollbar {
  display: none;
 }
`;

const LogoWrapper = styled.div`
 height: 100px;
 width: 100px;
 position: absolute;
 bottom: 0;
 left: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 overflow: hidden;
`;
