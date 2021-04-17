import React from 'react';
import {
  Text,
  Page,
  Document,
  View,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  section: {
    margin: 10,
    padding: 10,
    display: 'block',
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
    } = pattern;
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View  style={styles.section}>
            <Text>{title?.length > 0 ? title : 'Untitled'}</Text>
              {tags.map((tag) => (
                  <Text key={tag.id}>
                      {' '}
                      {tag.label}{' '}
                  </Text>
              ))}
          </View>

                      <View style={styles.section}>
          <Text>{`Difficulty: ${difficulty}`}</Text>
            </View>

            <View style={styles.section}>
                {books?.map((book) => (
                    <Text key={book.id} colour={book.colour}>
                        {' '}
                        {book.label}{' '}
                    </Text>
                ))}
            </View>

            <View style={styles.section}>
            <Text>Description</Text>
            <Text>{description}</Text>
        </View>

        </Page>
      </Document>
    );
  }
}