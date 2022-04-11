// React & Next
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

// Components
import styled from 'styled-components';

// Auth
import { useAuth } from '../../../utils/auth';
import withAuth from '../../../utils/withAuth';

const TeamPage: NextPage = () => {
 // Auth
 const { currentUser } = useAuth();

 // Opening and closing Modals
 const [openUserModal, setOpenUserModal] = useState('');
 const [openNewModal, setOpenNewModal] = useState('');

 // Get Project ID
 const router = useRouter();
 const { id: projectId } = router.query;

 return <div>team</div>;
};

export default withAuth(TeamPage);

const FilterSection = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 padding: 5px;
 margin-bottom: 20px;
`;

const SearchField = styled.input`
 border-radius: 1000px;
 width: 200px;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 padding: 6px 15px 6px 15px;
 font-size: large;
 color: grey;
`;

const MemberCounter = styled.div`
 display: flex;
 align-items: center;
 gap: 15px;
 h2 {
  text-transform: uppercase;
  color: #35307e;
  font-size: larger;
  font-weight: 500;
 }
`;

const UserList = styled.div`
 display: flex;
 flex-direction: row;
 flex-wrap: wrap;
 padding: 20px 20px 20px 0px;
 gap: 10px;
`;

const AddButton = styled.div`
 display: flex;
 justify-content: center;
 align-items: center;
 height: fit-content;
 min-height: 72px;
 width: 100%;
 min-width: 200px;
 max-width: 300px;
 box-sizing: border-box;
 padding: 10px;
 margin: 5px 0px 5px 0px;
 border-style: solid;
 border-radius: 10px;
 border-width: 1px;
 border-color: #d3d3d3;
 transition: 0.5s;
 cursor: pointer;
 &:hover {
  background-color: #35307e;
  transform: scale(1.05);
  > * {
   fill: white;
  }
 }
`;
