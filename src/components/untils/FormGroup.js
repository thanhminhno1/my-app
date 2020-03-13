import React from 'react';
import styled from 'styled-components'

const Group = styled.div`
  color: red;
`
const FormGroup = props => {
  const { children } = props;
  
  return (
    <Group>
      {children}
    </Group>
  )
}

export default FormGroup;