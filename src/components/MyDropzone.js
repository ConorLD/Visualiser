import React, {useMemo} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import styled from 'styled-components';


const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#afafaf';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
  font-weight: bold;
`;

function StyledDropzone({handleChange2}) {

  return (
    <Dropzone onDrop={acceptedFiles => handleChange2(acceptedFiles)}>
  {({getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject}) => (
    <section>
      <div {...getRootProps()} className="container">
        <Container>
          <input {...getInputProps()} />
          <p>Import TSV or CSV files</p>
          <em>Drag and drop or click to select your file</em>
        </Container>
      </div>
    </section>
  )}
</Dropzone>
  );
}

export default StyledDropzone;
