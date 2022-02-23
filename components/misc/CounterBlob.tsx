import styled from "styled-components";

const CounterBlobWrapper = styled.div`
  background-color: #ff0aba;
  color: white;
  width: 17px;
  height: 17px;
  padding: 5px;
  border-radius: 100000px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 0em;
`;

interface Props {
  count: number
}

function CounterBlob(props: Props): JSX.Element {
  const count = props.count || 0;
  return (
    <CounterBlobWrapper>
      <p>{count}</p>
    </CounterBlobWrapper>
  );
}

export default CounterBlob;