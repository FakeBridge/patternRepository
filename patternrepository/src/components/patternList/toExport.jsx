import React from 'react';
import {
  Page,
  View,
  Image,
  Text,
  Document,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
} );

export default class ComponentToExport extends React.PureComponent {
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
      <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{title?.length > 0 ? title : 'Untitled'}</Text>

          <View>
              {tags.map((tag) => (
                  <Text key={tag.id} colour="tag">
                      {' '}
                      {tag.label}{' '}
                  </Text>
              ))}
          </View>

          <Text>{`Difficulty: ${difficulty}`}</Text>

          <Text>Books</Text>
          <View>
              {books?.map((book) => (
                  <Text key={book.id} colour={book.colour}>
                      {' '}
                      {book.label}{' '}
                  </Text>
              ))}
          </View>

        </View>

          <View style={styles.section}>
          <Text>Description</Text>
          <Text>{description}</Text>
      </View>

        </Page>

      <Page size="A4" style={styles.page}>
      <Text>Finished works</Text>
              {finishedWorkImages.map((picture) => (
                  <Image
                      key={picture.name}
                      src={picture.url}
                      alt={picture.name}
                      width="50%"
                      style={{display: "inline"}}
                  />
              ))}
        </Page>

                {patternImages.map((picture) => (
              <Page key={picture.name} size="A4" style={styles.page}>
                  <Image
                    key={picture.name}
                    src={picture.url}
                    alt={picture.name}
                    width="100%"
                    />
                </Page>
                ))}
      </Document>
    );
  }
}