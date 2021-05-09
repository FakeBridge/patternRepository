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
    backgroundColor: '#FFF',
    padding: 50,
  },
  section: {
    marginBottom: 10,
    display: 'block',
  },
  h1: {
    fontSize: "18px",
    display: 'block',
    marginBottom: 5,
  },
  h2: {
    fontSize: "14px",
    display: 'block',
    marginBottom: 5,
  },
  text: {
    padding: 10,
    fontSize: "12px",
    width: "auto",
    display: 'inline',
    paddingLeft: "10px",
    backgroundColor: "#EEE",
    borderRadius: 5,
  },
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
      owner,
      tags,
      difficulty,
      books,
      description
    } = pattern;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View  style={styles.section}>
            <Text style={styles.h1}>{`${title} by ${owner}`}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.h2}>Tags</Text>
            <Text style={styles.text}>
              { tags.map((tag) => (tag.label)).join(", ") }
            </Text>
        </View>

          <View style={styles.section}>
            <Text style={styles.h2}>{`Difficulty: ${difficulty}`}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.h2}>Books</Text>
            <Text style={styles.text}>
                { books.map((book) => (book.label)).join(", ") }
          </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.h2}>Description</Text>
          <Text style={styles.text}>{description?.replace(/<\/?[^>]+(>|$)/g, "\n")}</Text>
          </View>


        </Page>
      </Document>
    );
  }
}