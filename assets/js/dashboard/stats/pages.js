import React from 'react';

import Bar from './bar'
import MoreLink from './more-link'
import numberFormatter from '../number-formatter'
import { eventName } from '../query'
import * as api from '../api'

export default class Pages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.fetchPages()
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({loading: true, pages: null})
      this.fetchPages()
    }
  }

  fetchPages() {
    api.get(`/api/stats/${this.props.site.domain}/pages`, this.props.query)
      .then((res) => this.setState({loading: false, pages: res}))
  }

  renderPage(page) {
    return (
      <React.Fragment key={page.name}>
        <div className="flex items-center justify-between text-sm">
          <span className="truncate" style={{maxWidth: '80%'}}>{page.name}</span>
          <span>{numberFormatter(page.count)}</span>
        </div>
        <Bar count={page.count} all={this.state.pages} color="orange" />
      </React.Fragment>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="stats-item bg-white shadow-md rounded p-4" style={{height: '424px'}}>
          <div className="loading my-32 mx-auto"><div></div></div>
        </div>
      )
    } else if (this.state.pages) {
      return (
        <div className="stats-item bg-white shadow-md rounded p-4" style={{height: '424px'}}>
          <h3>Top Content</h3>
          <div className="flex items-center mt-4 mb-3 justify-between text-grey-dark text-xs font-bold tracking-wide">
            <span>PAGE URL</span>
            <span>PAGEVIEWS</span>
          </div>
          { this.state.pages.map(this.renderPage.bind(this)) }
          <MoreLink site={this.props.site} list={this.state.pages} endpoint="pages" />
        </div>
      )
    }
  }
}
