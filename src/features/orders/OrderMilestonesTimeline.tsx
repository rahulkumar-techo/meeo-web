'use client';

import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Check, MapPin, Phone } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderMilestonesTimelineProps {
  order: Order;
}

/**
 * OrderMilestonesTimeline Component
 * Leverages Material UI (@mui/lab/Timeline) to display real-time shipment telemetry
 * with centered status dots, connected progress tracks, and contextual delivery metadata.
 */
export const OrderMilestonesTimeline: React.FC<OrderMilestonesTimelineProps> = ({ order }) => {
  return (
    <div className="bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#232d44] shadow-sm flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e7ff] dark:border-[#232d44]">
        <div>
          <h3 className="text-lg font-bold text-[#131b2e] dark:text-[#f1f3fa]">Real-Time Shipment Telemetry</h3>
          <p className="text-xs text-[#464556] dark:text-[#a6abbf]">GPS verification from Central Vault to Indiranagar Residence.</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#fd6a49] animate-pulse" />
          <span>Courier is 2.4 km from destination</span>
        </div>
      </div>

      {/* Material UI Timeline */}
      <Timeline
        position="right"
        sx={{
          p: 0,
          m: 0,
          width: '100%',
          [`& .${timelineItemClasses.root}:before`]: {
            display: 'none',
          },
        }}
      >
        {order.milestones.map((ms, index) => {
          const isLast = index === order.milestones.length - 1;

          return (
            <TimelineItem key={ms.id} sx={{ minHeight: 'auto', width: '100%', p: 0 }}>
              <TimelineSeparator sx={{ alignItems: 'center' }}>
                <TimelineDot
                  sx={{
                    p: 0,
                    m: 0,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: ms.current
                      ? '0 0 0 4px rgba(65, 44, 231, 0.2)'
                      : 'none',
                    bgcolor: ms.completed
                      ? '#059669'
                      : ms.current
                      ? '#412ce7'
                      : 'var(--surface-container-low, #f2f3ff)',
                    color: ms.completed || ms.current ? '#ffffff' : '#777588',
                    border: ms.completed || ms.current ? 'none' : '2px solid #c7c4d9',
                  }}
                >
                  {ms.completed ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : ms.current ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </TimelineDot>

                {!isLast && (
                  <TimelineConnector
                    sx={{
                      bgcolor: 'var(--border, #e2e7ff)',
                      width: '2px',
                      my: 0.5,
                      minHeight: 28,
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ py: 0, pl: { xs: 2, sm: 3 }, pr: 0, pb: isLast ? 0 : 3, width: '100%', flex: 1 }}>
                <div className="w-full bg-[#faf8ff] dark:bg-[#182032] p-4 sm:p-5 rounded-2xl border border-[#e2e7ff] dark:border-[#232d44] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-bold ${
                        ms.current ? 'text-[#412ce7] dark:text-[#685aff]' : 'text-[#131b2e] dark:text-[#f1f3fa]'
                      }`}
                    >
                      {ms.title}
                    </h4>
                    <p className="text-xs text-[#464556] dark:text-[#a6abbf] mt-0.5">{ms.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#777588] dark:text-[#868c9f] mt-2">
                      <MapPin className="w-3 h-3 text-[#412ce7] dark:text-[#685aff] shrink-0" />
                      <span className="truncate">{ms.location}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#777588] dark:text-[#868c9f] whitespace-nowrap shrink-0">
                    {ms.timestamp}
                  </span>
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      {/* Courier Agent Dispatch Strip */}
      <div className="p-4 rounded-2xl bg-[#eaedff]/60 dark:bg-[#1e273d]/60 border border-[#dae2fd] dark:border-[#28334d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#412ce7] text-white flex items-center justify-center font-bold text-xs">
            RK
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#131b2e] dark:text-[#f1f3fa]">Rajesh K. · BlueDart Priority Courier</h5>
            <p className="text-[11px] text-[#464556] dark:text-[#a6abbf]">Inspected and sanitized vehicle</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Calling Courier Agent: +91 98450 99882')}
          className="px-4 py-2 bg-white dark:bg-[#131826] hover:bg-[#faf8ff] dark:hover:bg-[#182032] text-[#412ce7] dark:text-[#685aff] border border-[#dae2fd] dark:border-[#28334d] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Dispatch (+91 98450 99882)</span>
        </button>
      </div>
    </div>
  );
};
