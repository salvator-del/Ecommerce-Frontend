const { default: styled } = require("styled-components");

const StyledDiv = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 10 20px; //switch it up for nav spacing
`;

export default function Center({children}) {
    return (
        <StyledDiv>{children}</StyledDiv>
    );
}