import { Link } from '@posthog/lemon-ui'
import { useActions, useValues } from 'kea'
// import { EVENT_DEFINITIONS_PER_PAGE } from 'lib/constants'
import { LemonBanner } from 'lib/lemon-ui/LemonBanner'
// import { EventDefinitionProperties } from 'scenes/data-management/events/EventDefinitionProperties'
import { eventsSceneLogic } from 'scenes/events/eventsSceneLogic'
import { urls } from 'scenes/urls'

import { Query } from '~/queries/Query/Query'

/* const eventTypeOptions: LemonSelectOptions<EventDefinitionType> = [
    { value: EventDefinitionType.Event, label: 'All events', 'data-attr': 'event-type-option-event' },
    {
        value: EventDefinitionType.EventCustom,
        label: 'Custom events',
        'data-attr': 'event-type-option-event-custom',
    },
    {
        value: EventDefinitionType.EventPostHog,
        label: 'PostHog events',
        'data-attr': 'event-type-option-event-posthog',
    },
]
*/

export function EventDefinitionsTable(): JSX.Element {
    // const { eventDefinitions, eventDefinitionsLoading, filters } = useValues(eventDefinitionsTableLogic)
    // const { loadEventDefinitions, setFilters } = useActions(eventDefinitionsTableLogic)
    // const { hasTagging } = useValues(organizationLogic)
    const { query } = useValues(eventsSceneLogic)
    const { setQuery } = useActions(eventsSceneLogic)
    /*
    const columns: LemonTableColumns<EventDefinition> = [
        {
            key: 'icon',
            width: 0,
            render: function Render(_, definition: EventDefinition) {
                return <span className="text-xl text-muted">{getEventDefinitionIcon(definition)}</span>
            },
        },
        {
            title: 'Name',
            key: 'name',
            render: function Render(_, definition: EventDefinition) {
                return (
                    <DefinitionHeader
                        definition={definition}
                        to={urls.eventDefinition(definition.id)}
                        taxonomicGroupType={TaxonomicFilterGroupType.Events}
                    />
                )
            },
            sorter: true,
        },
        {
            title: 'Last seen',
            key: 'last_seen_at',
            className: 'definition-column-last_seen_at',
            render: function Render(_, definition: EventDefinition) {
                return definition.last_seen_at ? <TZLabel time={definition.last_seen_at} /> : null
            },
            sorter: true,
        },
        ...(hasTagging
            ? [
                  {
                      title: 'Tags',
                      key: 'tags',
                      render: function Render(_, definition: EventDefinition) {
                          return <ObjectTags tags={definition.tags ?? []} staticOnly />
                      },
                  } as LemonTableColumn<EventDefinition, keyof EventDefinition | undefined>,
              ]
            : []),
        {
            key: 'actions',
            width: 0,
            render: function RenderActions(_, definition: EventDefinition) {
                return (
                    <More
                        data-attr={`event-definitions-table-more-button-${definition.name}`}
                        overlay={
                            <>
                                <LemonButton
                                    to={
                                        combineUrl(urls.replay(), {
                                            filters: {
                                                events: [
                                                    {
                                                        id: definition.name,
                                                        type: 'events',
                                                        order: 0,
                                                        name: definition.name,
                                                    },
                                                ],
                                            },
                                        }).url
                                    }
                                    fullWidth
                                    sideIcon={<IconPlayCircle />}
                                    data-attr="event-definitions-table-view-recordings"
                                >
                                    View recordings
                                </LemonButton>
                            </>
                        }
                    />
                )
            },
        },
    ]
*/
    return (
        <div data-attr="manage-events-table">
            <LemonBanner className="mb-4" type="info">
                Looking for{' '}
                {filters.event_type === 'event_custom'
                    ? 'custom '
                    : filters.event_type === 'event_posthog'
                    ? 'PostHog '
                    : ''}
                event usage statistics?{' '}
                <Link
                    to={urls.insightNewHogQL(
                        'SELECT event, count()\n' +
                            'FROM events\n' +
                            'WHERE {filters}\n' +
                            (filters.event_type === 'event_custom'
                                ? "AND event NOT LIKE '$%'\n"
                                : filters.event_type === 'event_posthog'
                                ? "AND event LIKE '$%'\n"
                                : '') +
                            'GROUP BY event\n' +
                            'ORDER BY count() DESC',
                        { dateRange: { date_from: '-24h' } }
                    )}
                >
                    Query with SQL
                </Link>
            </LemonBanner>

            {/* 
						this section would need to be replaced with a query object
						
						modeled on person component filter?
						 - name includes? excludes?
						 - date range

						what information does the query object need to render properly?
						
						*/}

            <Query query={query} setQuery={setQuery} />
            {/*********************************
             *
             *
             *
             *
             * *********************************
             
            <div className="flex justify-between items-center gap-2 mb-4">
                <LemonInput
                    type="search"
                    placeholder="Search for events"
                    onChange={(v) => setFilters({ event: v || '' })}
                    value={filters.event}
                />
                <div className="flex items-center gap-2">
                    <span>Type:</span>
                    <LemonSelect
                        value={filters.event_type}
                        options={eventTypeOptions}
                        data-attr="event-type-filter"
                        dropdownMatchSelectWidth={false}
                        onChange={(value) => {
                            setFilters({ event_type: value as EventDefinitionType })
                        }}
                        size="small"
                    />
                </div>
            </div>
         
            <LemonTable
                columns={columns}
                data-attr="events-definition-table"
                loading={eventDefinitionsLoading}
                rowKey="id"
                pagination={{
                    controlled: true,
                    currentPage: eventDefinitions?.page ?? 1,
                    entryCount: eventDefinitions?.count ?? 0,
                    pageSize: EVENT_DEFINITIONS_PER_PAGE,
                    onForward: eventDefinitions.next
                        ? () => {
                              loadEventDefinitions(eventDefinitions.next)
                          }
                        : undefined,
                    onBackward: eventDefinitions.previous
                        ? () => {
                              loadEventDefinitions(eventDefinitions.previous)
                          }
                        : undefined,
                }}
                onSort={(newSorting) =>
                    setFilters({
                        ordering: newSorting
                            ? `${newSorting.order === -1 ? '-' : ''}${newSorting.columnKey}`
                            : undefined,
                    })
                }
                expandable={{
                    expandedRowRender: function RenderPropertiesTable(definition) {
                        return (
                            <div className="p-4">
                                <EventDefinitionProperties definition={definition} />
                            </div>
                        )
                    },
                    rowExpandable: () => true,
                    noIndent: true,
                }}
                dataSource={eventDefinitions.results}
                useURLForSorting={false}
                emptyState="No event definitions"
                nouns={['event', 'events']}
            />
							*/}
            {/* receiving information from above input or select options */}
        </div>
    )
}
