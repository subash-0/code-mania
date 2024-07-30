import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const Clients = (props) => {

  let username = props.username;
  return (
    <div className=''>
   <Avatar
  size={30}
  name={username}
  githubHandle={username}
  variant="marble"
  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
  round={10}
/>
<Link to={`https://github.com/${username}`} className='ml-2 text-sm' target='_blank'>{
  username?.length>8 ?username.substring(0,11) +" ...": username
  
  
  }</Link>
     
    </div>
  )
}

export default Clients
