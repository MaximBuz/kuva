// React & Next
import React, { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

// Components
import styled from 'styled-components';
import { UilPen } from '@iconscout/react-unicons';

// Auth
import { useAuth } from '../../../utils/auth';
import withAuth from '../../../utils/withAuth';
import { collection, doc, Timestamp } from 'firebase/firestore';
import { firestore, storage } from '../../../utils/firebase';
import {
 useFirestoreDocumentData,
 useFirestoreDocumentDeletion,
 useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import ProjectAvatar from '../../../components/misc/ProjectAvatar';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const SettingsPage: NextPage = () => {
 // get current user
 const { currentUser } = useAuth();

 // Get Project from identifier in URL
 const router = useRouter();
 const { id: projectId } = router.query;

 // Setting up mutations
 const queryClient = useQueryClient();
 const projectRef = doc(
  collection(firestore, 'projects'),
  Array.isArray(projectId) ? projectId[0] : projectId
 );
 const projectData = useFirestoreDocumentData(['projects', projectId], projectRef);
 const mutation = useFirestoreDocumentMutation(projectRef, { merge: true });
 const deletion = useFirestoreDocumentDeletion(projectRef, {
  onSuccess() {
   queryClient.invalidateQueries(['projects']);
   toast.success('Project deleted!');
  },
  onError() {
   toast.error('Failed to delete project!');
  },
 });

 // Handle deletion of project
 const deleteProject = () => {
  deletion.mutate();
  router.replace('/');
 };

 // Handle archiving project
 const archiveProject = async () => {
  mutation.mutate(
   { archived: true },
   {
    onSuccess() {
     queryClient.invalidateQueries(['projects']);
     toast.success('Project archived!');
    },
    onError() {
     toast.error('Failed to archive project!');
    },
   }
  );
  router.replace('/');
 };

  // Handle unarchiving project
  const unarchiveProject = async () => {
    mutation.mutate(
     { archived: false },
     {
      onSuccess() {
       queryClient.invalidateQueries(['projects']);
       toast.success('Project restored!');
      },
      onError() {
       toast.error('Failed to restore project!');
      },
     }
    );
    router.replace('/');
   };

 /* 
----------------------------
Handling editable fields 
----------------------------
*/
 // Handle Title Editing
 const [titleEditMode, setTitleEditMode] = useState<boolean>(false);
 const editTitleModeOnClick = (e: React.MouseEvent<HTMLElement>): void => {
  setTitleEditMode(!titleEditMode);
 };
 const titleRef = useRef<HTMLInputElement>(null);
 const handleTitleSubmit = (e: SyntheticEvent): void => {
  e.preventDefault();
  mutation.mutate(
   {
    title: titleRef.current.value,
   },
   {
    onSuccess() {
     queryClient.invalidateQueries(['projects', projectId]);
     queryClient.invalidateQueries(['projects']);
     toast.success('Updated the title!');
    },
    onError() {
     toast.error('Failed to update project!');
    },
   }
  );
  setTitleEditMode(false);
 };

 // Handle Summary Editing
 const [summaryEditMode, setSummaryEditMode] = useState<boolean>(false);
 const editSummaryModeOnClick = (e: React.MouseEvent<HTMLElement>): void => {
  setSummaryEditMode(!summaryEditMode);
 };
 const summaryRef = useRef<HTMLInputElement>(null);
 const handleSummarySubmit = (e: SyntheticEvent): void => {
  e.preventDefault();
  mutation.mutate(
   {
    summary: summaryRef.current.value,
   },
   {
    onSuccess() {
     queryClient.invalidateQueries(['projects', projectId]);
     queryClient.invalidateQueries(['projects']);
     toast.success('Updated the summary!');
    },
    onError() {
     toast.error('Failed to update project!');
    },
   }
  );
  setSummaryEditMode(false);
 };

 // Handle Description Editing
 const [descriptionEditMode, setDescriptionEditMode] = useState(false);
 const editDescriptionModeOnClick = (e: React.MouseEvent<HTMLElement>): void => {
  setDescriptionEditMode(!descriptionEditMode);
 };
 const descriptionRef = useRef<HTMLInputElement>(null);
 const handleDescriptionSubmit = (e: SyntheticEvent): void => {
  e.preventDefault();
  mutation.mutate(
   {
    description: descriptionRef.current.value,
   },
   {
    onSuccess() {
     queryClient.invalidateQueries(['projects', projectId]);
     queryClient.invalidateQueries(['projects']);
     toast.success('Updated the description!');
    },
    onError() {
     toast.error('Failed to update project!');
    },
   }
  );
  setDescriptionEditMode(false);
 };

 // Handle Project Picture uploading
 const imageInput = useRef<HTMLInputElement>(null);

 async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const [image] = e.target.files;

  // uploading avatar to Google Cloud Storage
  const metadata = {
   contentType: 'image/*',
   uploaded: Timestamp.now(),
   author: currentUser.uid,
  };
  const avatarRef = ref(storage, 'projectAvatar/' + projectId);

  await uploadBytes(avatarRef, image, metadata);

  const downloadUrl = await getDownloadURL(avatarRef);
  mutation.mutate(
   {
    avatar: downloadUrl,
   },
   {
    onSuccess() {
     queryClient.invalidateQueries(['projects', projectId]);
     queryClient.invalidateQueries(['projects']);
     toast.success('Updated profile picture!');
    },
   }
  );
 }

 return (
  <>
   <Wrapper
    onClick={(e: React.MouseEvent & { target: Element }): void => {
     /* Closing editable fields on click outside of them */
     titleEditMode && e.target.localName !== 'input' && setTitleEditMode(false);

     summaryEditMode && e.target.localName !== 'input' && setSummaryEditMode(false);

     descriptionEditMode && e.target.localName !== 'textarea' && setDescriptionEditMode(false);
    }}
   >
    <WelcomeWrapper>
     <input
      name='avatar'
      type='file'
      style={{ display: 'none' }}
      accept='image/*'
      onChange={onImageChange}
      ref={imageInput}
     />
     <label htmlFor='avatar' onClick={() => imageInput.current.click()}>
      <AvatarUploadWrapper>
       <AvatarEditButton>
        <UilPen className='edit-pen' />
       </AvatarEditButton>
       <ProjectAvatar projectKey={projectData?.data?.key} url={projectData?.data?.avatar} size={150} />
      </AvatarUploadWrapper>
     </label>
     <WelcomeMessage>
      <div style={{ display: 'flex', gap: '10px' }}>
       <DeleteButton onClick={deleteProject}>
        <p>Delete Project</p>
        <span className='tooltiptext'>Caution: Cannot undo this action!</span>
       </DeleteButton>
       <ArchiveButton onClick={projectData?.data?.archived ? unarchiveProject : archiveProject}>
        <p>{projectData?.data?.archived ? "Unarchive" : "Archive"}</p>
       </ArchiveButton>
      </div>
      {/* Editable Project Title */}

      {titleEditMode ? (
       <form onSubmit={handleTitleSubmit} style={{ textAlign: 'center' }}>
        <TitleEdit defaultValue={projectData?.data?.title} ref={titleRef}></TitleEdit>
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
       <Title editable={true} onClick={editTitleModeOnClick}>
        {projectData?.data?.title}
       </Title>
      )}

      {/* Editable Project Summary */}

      {summaryEditMode ? (
       <form onSubmit={handleSummarySubmit} style={{ textAlign: 'center' }}>
        <SummaryEdit
         defaultValue={projectData?.data?.summary || 'No Summary added yet'}
         ref={summaryRef}
        ></SummaryEdit>
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
       <Summary editable={true} onClick={editSummaryModeOnClick}>
        {projectData?.data?.summary}
       </Summary>
      )}
     </WelcomeMessage>
    </WelcomeWrapper>
    {/* Editable Project Description */}

    {descriptionEditMode ? (
     <form onSubmit={handleDescriptionSubmit} style={{ textAlign: 'center' }}>
      <DescriptionEdit defaultValue={projectData?.data?.description} ref={descriptionRef}></DescriptionEdit>
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
     <Description editable={true} onClick={editDescriptionModeOnClick}>
      {projectData?.data?.description || 'Add a project description'}
     </Description>
    )}
   </Wrapper>
  </>
 );
};

export default withAuth(SettingsPage);

/* STYLED COMPONENTS */

const Wrapper = styled.div<any>`
 display: flex;
 flex-direction: column;
 gap: 40px;
 align-items: flex-start;
 width: 95%;
 min-height: 100vh;
`;

const AvatarEditButton = styled.div`
 width: 40px;
 height: 40px;
 background-color: #ff08b9;
 border-radius: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
 color: white;
 position: absolute;
 right: 0;
 bottom: 0;
 cursor: pointer;
 transition: 0.3s;

 :hover {
  transform: scale(1.1);
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.15);
 }
`;

const AvatarUploadWrapper = styled.div`
 position: relative;
`;

const WelcomeMessage = styled.div`
 display: flex;
 flex-direction: column;
 gap: 8px;
`;

const WelcomeWrapper = styled.div`
 display: flex;
 flex-direction: row;
 gap: 20px;
 align-items: center;
 h2 {
  font-size: xx-large;
  font-weight: bolder;
  color: #35307e;
 }
 h2 {
  font-size: large;
  font-weight: normal;
  color: #515151;
 }
`;

const Title = styled.h1<any>`
 font-size: xx-large;
 font-weight: bold;
 padding: 5px 5px 5px 5px;
 margin: -5px;
 color: #35307e;
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

const TitleEdit = styled.input`
 width: 100%;
 font-size: xx-large;
 font-weight: bold;
 padding: 5px 5px 5px 5px;
 margin: -5px;
 color: #35307e;
 border-radius: 5px;
 outline-width: 1.5px;
 outline-color: #35307e;
`;

const Summary = styled.h1<any>`
 font-size: large;
 font-weight: normal;
 color: #515151;
 padding: 5px 5px 5px 5px;
 margin: -5px;
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

const SummaryEdit = styled.input`
 width: 100%;
 font-size: large;
 font-weight: normal;
 color: #515151;
 padding: 5px 5px 5px 5px;
 margin: -5px;
 border-radius: 5px;
 outline-width: 1.5px;
 outline-color: #35307e;
`;

const DeleteButton = styled.div`
 background-color: #e96262;
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 width: fit-content;
 height: fit-content;
 font-size: medium;
 font-weight: 400;
 transition: 0.15s;
 cursor: pointer;
 position: relative;
 .tooltiptext {
  position: absolute;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.6s;
  width: 120px;
  bottom: 125%;
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
  ::after {
   content: ' ';
   position: absolute;
   top: 100%; /* At the bottom of the tooltip */
   left: 10%;
   margin-left: -5px;
   border-width: 5px;
   border-style: solid;
   border-color: #555 transparent transparent transparent;
  }
 }
 :hover {
  .tooltiptext {
   visibility: visible;
   opacity: 1;
  }
 }
`;

const ArchiveButton = styled(DeleteButton)`
 background-color: #f8b965;
`;

const Description = styled.h1<any>`
 font-size: large;
 font-weight: normal;
 color: #515151;
 min-width: 70%;
 padding: 5px 5px 5px 5px;
 margin: -5px;
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

const DescriptionEdit = styled.textarea<any>`
 font-size: large;
 font-weight: normal;
 color: #515151;
 margin: 0;
 min-width: 800px;
 padding: 5px 5px 5px 5px;
 margin: -5px;
 border-radius: 5px;
 outline-width: 1.5px;
 outline-color: #35307e;
`;
