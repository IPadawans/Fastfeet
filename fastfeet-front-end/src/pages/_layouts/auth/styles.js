import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  height: 100%;
  background: #7d40e7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  top: 225px;
  left: 540px;
  width: 360px;
  height: 425px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 10px #00000033;
  border-radius: 4px;
  opacity: 1;

  img {
    margin: 60px 35px 0px;
  }

  form {
    display: flex;
    flex-direction: column;
    margin: 30px;

    input {
      background: #ffffff 0% 0% no-repeat padding-box;
      border: 1px solid #dddddd;
      border-radius: 4px;
      opacity: 1;
      padding: 10px;
      margin: 9px 0 15px;
    }
    span {
      color: #f64c75;
      align-self: flex-start;
      margin-bottom: 10px;
      font-weight: bold;
    }

    button {
      width: 300px;
      height: 45px;
      background: #7d40e7 0% 0% no-repeat padding-box;
      border-radius: 4px;
      opacity: 1;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#7d40e7')};
      }
    }
  }
`;
