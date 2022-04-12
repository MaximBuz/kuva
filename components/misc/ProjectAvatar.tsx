import styled from 'styled-components';

interface SizeProps {
 size: number;
 url: string;
}

const ProjectAvatarWrapper = styled.div<SizeProps>`
 width: ${(props) => props.size}px;
 height: ${(props) => props.size}px;
 border-radius: 10000px;
 background-color: #35307e;
 color: white;
 font-weight: bolder;
 display: flex;
 justify-content: center;
 align-items: center;
 overflow: hidden;
 h1 {
  font-size: xx-large;
 }
`;

const ProjectPicture = styled.img`
 object-fit: contain;
 object-position: 50% 50%;
 width: 100%;
 height: 100%;
`;

function ProjectAvatar({ projectKey, url, size }: { projectKey: string; url: string; size: number }) {
 return (
  <ProjectAvatarWrapper url={url} size={size}>
   {url ? <ProjectPicture src={url} /> : <h1>{projectKey}</h1>}
  </ProjectAvatarWrapper>
 );
}

export default ProjectAvatar;
