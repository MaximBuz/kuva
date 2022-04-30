import styled from 'styled-components';
import React, { useState, useRef, SyntheticEvent } from 'react';
import ReactDom from 'react-dom';

// Firebase
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

// Auth
import { toast } from 'react-toastify';
import UserAvatar from '../misc/UserAvatar';
import { ICollaboratorWithData } from '../../types/users';

export default function UserModal({
 closeModal,
 projectId,
 collaborator,
 collaborators,
 refresh,
}: {
 closeModal: () => void;
 projectId: string;
 collaborator: ICollaboratorWithData;
 collaborators: ICollaboratorWithData[];
 refresh: () => void;
}): React.ReactPortal {
 // setting up mutation
 const ref = doc(firestore, 'projects', projectId);
 const mutation = useFirestoreDocumentMutation(ref, { merge: true });

 //  handling changing role on project
 const [projectRoleEditMode, setProjectRoleEditMode] = useState<boolean>(false);
 const editModeOnClick = (e: React.MouseEvent<HTMLElement>): void => {
  setProjectRoleEditMode(!projectRoleEditMode);
 };
 const roleRef = useRef<HTMLInputElement>(null);
 const handleRoleSubmit = (e: SyntheticEvent): void => {
  e.preventDefault();
  const newCollaborators = collaborators.map((teamMember: ICollaboratorWithData) => {
    return {
     user: doc(collection(firestore, 'users'), teamMember.user.uid),
     role: roleRef.current.value,
    };
  });
  mutation.mutate({
   collaborators: newCollaborators,
  });
  refresh();
  toast.success('Updated project role!');
  setProjectRoleEditMode(false);
  closeModal();
 };

 async function deleteCollaborator() {
  const newCollaborators = collaborators.filter(
   (teamMember: ICollaboratorWithData) => teamMember.user.uid != collaborator.user.uid
  );
  mutation.mutate({
   collaborators: newCollaborators,
  });
  refresh();
  toast.success('Removed team member from project!');
  closeModal();
 }

 return ReactDom.createPortal(
  <>
   <GreyBackground onClick={() => closeModal()}>
    <ModalWrapper
     onClick={(e: React.MouseEvent & { target: Element }): void => {
      /* Closing editable fields on click outside of them */
      projectRoleEditMode && e.target.localName !== 'input' && setProjectRoleEditMode(false);
      e.stopPropagation();
     }}
    >
     <Header>
      <HeaderPills>
       {!collaborator.role.toLowerCase().includes('owner') ? (
        <DeleteButton onClick={deleteCollaborator}>
         <p>Remove from Team</p>
        </DeleteButton>
       ) : (
        <DeleteButton disabled>
         <p>Remove from Team</p>
         <span className='tooltiptext'>Cannot delete owners</span>
        </DeleteButton>
       )}
      </HeaderPills>
      <CloseButton onClick={() => closeModal()} viewBox='0 0 17 19'>
       <path d='M1 1L16 18M16 1L1 18' stroke='black' />
      </CloseButton>
     </Header>
     <Content>
      <UserAvatar name={collaborator.user.displayName} url={collaborator.user.avatar} size={150} />
      <UserName>{collaborator.user.displayName}</UserName>

      <AttributeName>Title:</AttributeName>
      <AttributeValue editable={false}>{collaborator.user.jobTitle}</AttributeValue>

      <AttributeName>Role on project:</AttributeName>
      {projectRoleEditMode ? (
       <form onSubmit={handleRoleSubmit} style={{ textAlign: 'center' }}>
        <AttributeValueEdit defaultValue={collaborator.role} ref={roleRef}></AttributeValueEdit>
        <input
         type='submit'
         style={{
          visibility: 'hidden',
          display: 'none',
          width: '0',
          height: '0',
         }}
        />
       </form>
      ) : (
       <AttributeValue editable={true} onClick={editModeOnClick}>
        {collaborator.role || 'No role added yet'}
       </AttributeValue>
      )}

      <AttributeName>Email:</AttributeName>
      <AttributeValue editable={false}>{collaborator.user.email}</AttributeValue>
     </Content>
    </ModalWrapper>
   </GreyBackground>
  </>,
  document.getElementById('portal')
 );
}

/* Styled Components */

const GreyBackground = styled.div`
 position: fixed;
 width: 100vw;
 height: 100vh;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, 0.7);
 z-index: 100000;
`;

const ModalWrapper = styled.div<any>`
 width: 30%;
 max-width: 500px;
 position: fixed;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 background-color: #fff;
 padding: 30px 30px 60px 30px;
 z-index: 100000;
 border-radius: 25px;
 box-shadow: 0px 5px 50px 10px rgba(0, 0, 0, 0.45);
 display: flex;
 flex-direction: column;
 gap: 20px;
`;

const Header = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
`;

const HeaderPills = styled.div`
 display: flex;
 flex-direction: row;
 gap: 10px;
`;

const DeleteButton = styled.div<any>`
 background-color: ${({ disabled }) => (disabled ? 'lightgrey' : '#e96262')};
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 width: fit-content;
 height: fit-content;
 font-size: medium;
 font-weight: 400;
 transition: 0.15s;
 cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
 position: relative;
 .tooltiptext {
  visibility: hidden;
  position: absolute;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.6s;
  width: 120px;
  top: 140%;
  left: 50%;
  margin-left: -60px;
  ::after {
   content: ' ';
   position: absolute;
   bottom: 100%; /* At the top of the tooltip */
   left: 50%;
   margin-left: -5px;
   border-width: 5px;
   border-style: solid;
   border-color: transparent transparent #555 transparent;
  }
 }
 ${({ disabled }) =>
  disabled &&
  `
    :hover {
      .tooltiptext {
        visibility: visible;
        opacity: 1;
      }
    }
  `};
`;

const CloseButton = styled.svg.attrs({
 width: '24',
 height: '24',
 fill: 'none',
 xmlns: 'http://www.w3.org/2000/svg',
})`
 cursor: pointer;
`;

const Content = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 25px;
`;

const UserName = styled.div`
 font-weight: bolder;
 font-size: 2em;
 margin-bottom: 25px;
`;

const AttributeName = styled.div`
 font-size: small;
 margin-bottom: -22px;
 color: #ff0aba;
`;

interface EditableStyleProps extends React.HTMLAttributes<HTMLElement> {
 editable: boolean;
}

const AttributeValue = styled.div<EditableStyleProps>`
 font-size: large;
 padding: 5px;
 :hover {
  outline: ${(props) => {
   if (props.editable) {
    return 'solid';
   } else {
    return 'none';
   }
  }};
  border-radius: 5px;
  outline-width: 1.5px;
 }
`;

const AttributeValueEdit = styled.input`
 font-size: large;
 padding: 5px;
 border-radius: 5px;
 outline-width: 1.5px;
`;
