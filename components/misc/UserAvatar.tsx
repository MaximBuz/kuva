import styled from 'styled-components';

interface SizeProps {
 size: number;
 inComments: boolean;
 url: string;
}

const UserCardAvatar = styled.div<SizeProps>`
 width: ${(props) => props.size}px;
 height: ${(props) => props.size}px;
 font-size: ${(props) => props.size / 50}em;
 border-radius: 10000px;
 background-color: #35307e;
 color: white;
 font-weight: bolder;
 display: flex;
 justify-content: center;
 align-items: center;
 overflow: hidden;
`;

const UserProfilePicture = styled.img`
 object-fit: cover;
 object-position: 50% 50%;
 width: 100%;
 height: 100%;
`;

function UserAvatar({
 inComments,
 name,
 url,
 size,
}: {
 inComments?: boolean;
 name: string;
 url: string;
 size: number;
}) {
 return (
  <UserCardAvatar inComments={inComments} url={url} size={size}>
   {url ? (
    <UserProfilePicture src={url} />
   ) : (
    name
     ?.split(' ')
     .map((word: string) => word[0].toUpperCase())
     .join(' ')
   )}
  </UserCardAvatar>
 );
}

export default UserAvatar;
