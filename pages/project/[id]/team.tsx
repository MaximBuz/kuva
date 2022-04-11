// React & Next
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

// Components
import styled from 'styled-components';
import { UilPlusCircle } from '@iconscout/react-unicons';

// Auth
import { useAuth } from '../../../utils/auth';
import withAuth from '../../../utils/withAuth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { useFirestoreDocumentData } from '@react-query-firebase/firestore';
import CounterBlob from '../../../components/misc/CounterBlob';
import UserCard from '../../../components/cards/UserCard';
import { IUser } from '../../../types/users';

const TeamPage: NextPage = () => {
 // Auth
 const { currentUser } = useAuth();

 // Opening and closing Modals
 const [openUserModal, setOpenUserModal] = useState<any>('');
 const [openNewModal, setOpenNewModal] = useState<any>('');

 // Get Project from firestore
 const router = useRouter();
 const { id: projectId } = router.query;
 const projectRef = doc(firestore, 'projects', Array.isArray(projectId) ? projectId[0] : projectId);

 // load project into state
 const [project, setProject] = useState(null);

 useEffect(() => {
  const getCollaborators = async () => {
   const projectSnap = await getDoc(projectRef);
   if (projectSnap.exists()) {
    const collaborators = await Promise.all(
     projectSnap.data().collaborators.map(async (ref: any) => {
      const user = await Promise.resolve(getDoc(ref.user));
      const role = ref.role;
      return {user: user.data(), role: role};
     })
    );
    setProject({ ...projectSnap.data(), collaborators: collaborators });
   }
  };
  getCollaborators();
 }, []);

 // Counting team members
 const memberCount = project?.collaborators?.length;

 console.log(project);
 return (
  <>
   <FilterSection>
    <p>
     Search For Team Members:{' '}
     <span>
      <SearchField type='text'></SearchField>
     </span>
    </p>
    {/* <div className="filter-checkbox">
                    </div> */}
   </FilterSection>
   <MemberCounter>
    <h2>Your project-team</h2>
    <CounterBlob count={memberCount || 0} />
   </MemberCounter>
   <UserList>
    {project?.collaborators?.map((collaborator: any) => {
     return (
      <UserCard
       key={collaborator.user.uid}
       onClick={() => {
        setOpenUserModal(collaborator.user);
       }}
       role={collaborator.role}
       user={collaborator.user}
      ></UserCard>
     );
    })}
    <AddButton
     onClick={() => {
      setOpenNewModal(!openNewModal);
     }}
    >
     <UilPlusCircle className='add-icon' size='50' color='#51515170' />
    </AddButton>
   </UserList>

   {/* {openNewModal && <NewModal closeModal={setOpenNewModal} projectId={identifier} />}
   {openUserModal && (
    <UserModal closeModal={setOpenUserModal} user={openUserModal} projectId={identifier} members={members} />
   )} */}
  </>
 );
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
