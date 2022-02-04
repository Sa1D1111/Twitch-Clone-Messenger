import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
} from 'stream-chat-react';

import Auth from './components/Auth.js'
import MessagingContainer from "./components/MessagingContainer";
import Video from "./components/Video";
import '@stream-io/stream-chat-css/dist/css/index.css';
import {customStyles} from "./styles/customStyles";


const client = StreamChat.getInstance('ct4f5z4hqg4w');

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [channel, setChannel] = useState(null);
  const [users, setUsers] = useState(null);

  const authToken = cookies.AuthToken

    console.log(authToken)

    useEffect( async () => {
        if (authToken) {
            const { users } = await client.queryUsers({ role: 'user'})
            setUsers(users)
        }
    }, [])

  //  id: 'dave-matthews',
  //    name: 'Dave Matthews',
  //      },
  //   authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGF2ZS1tYXR0aGV3cyJ9._P-pU4wOYrFcuE15xG2IDb8AtSvKq9QlYE_Qm70mFbA',
  //     );


  const setupClient = async () => {
    try {
      await client.connectUser(
          {
            id: cookies.UserId,
            name: cookies.Name,
            hashedPassword: cookies.HashedPassword,
          },
          authToken
      );

      const channel = await client.channel('gaming', 'gaming-demo', {
        name: 'Gaming Demo',
      });
      setChannel(channel);
    } catch (err) {
      console.log(err);
    }
  };

  /*const customStyle = {
    '--primary-color': 'purple',
    '--md-font': '1.2rem',
    '--xs-m': '1.2rem',
    '--xs-p': '1.2rem',
  };*/ // change color and font size.

  if (authToken) setupClient()

  return (
      <>
        {!authToken && <Auth/>}
        {authToken && <Chat client = {client} customStyles={customStyles}>
          <Channel channel ={channel}>
            <Video/>
              <MessagingContainer users={users}/>
           </Channel>
          </Chat>}
        </>
  );
};

export default App;
