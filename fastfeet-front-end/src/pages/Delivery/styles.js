import styled from 'styled-components';

export const Container = styled.div`
  margin: 0px 120px 0px 120px;
  header {
    margin: 34px 0px;

    strong {
      font-size: 24px;
      color: #000;
    }
  }
`;

export const SearchAndSignDeliveries = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #ddd;
    height: 36px;
    width: 240px;
    border-radius: 4px;
    background: #fff;

    button {
      border: none;
      margin: 0px 8px 0px 8px;
    }

    input {
      color: #999;
      font-size: 14px;
      border: none;
      width: 100%;
    }
  }

  #newDeliveryButton {
    display: flex;
    align-items: center;
    background: #7d40e7;
    width: 150px;
    height: 36px;
    border-radius: 4px;

    svg {
      margin: 0px 10px;
    }
    strong {
      color: #fff;
    }
  }
`;
