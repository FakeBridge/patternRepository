import React from 'react';

import {
  ItemHeader,
  ItemLabel,
  Difficulty,
  Tag,
  Description,
  TagRow,
} from '../../design/styledComponents';

export default class ComponentToPrint extends React.PureComponent {
  constructor( props ) {
    super( props );
    this.state = {};
  }


  render() {
    const {
      pattern
    } = this.props;
    const {
      title,
      tags,
      difficulty,
      books,
      description,
      patternImages,
      finishedWorkImages
    } = pattern;
    return (
      <div style={{padding: "100px"}}>
        <ItemHeader>{title?.length > 0 ? title : 'Untitled'}</ItemHeader>

          <TagRow>
              {tags.map((tag) => (
                  <Tag key={tag.id} colour="tag">
                      {' '}
                      {tag.label}{' '}
                  </Tag>
              ))}
          </TagRow>

          <Difficulty difficulty={difficulty} />

          <ItemLabel>Books</ItemLabel>
          <TagRow>
              {books?.map((book) => (
                  <Tag key={book.id} colour={book.colour}>
                      {' '}
                      {book.label}{' '}
                  </Tag>
              ))}
          </TagRow>

          <ItemLabel>Description</ItemLabel>
          <Description
              dangerouslySetInnerHTML={{
                  __html: description,
              }}
          />

        <div style={{display: "block", pageBreakBefore: "always", paddingTop: "100px"}}>
        <ItemLabel>Finished Works</ItemLabel>
        <div>
              {finishedWorkImages.map((picture) => (
                <div key={picture.name} style={{display: "inline"}}>
                  <img
                      key={picture.name}
                      src={picture.url}
                      alt={picture.name}
                      width="50%"
                      style={{display: "inline"}}
                  />
              </div>
              ))}
            </div>
          </div>

              <div>
                {patternImages.map((picture) => (
                  <div key={picture.name} style={{height: "100%", paddingTop: "100px"}}>
                  <img
                    key={picture.name}
                    src={picture.url}
                    alt={picture.name}
                    width="100%"
                    style={{display: "block", pageBreakBefore: "auto"}}
                    />
                </div>
                ))}
              </div>
      </div>
    );
  }
}