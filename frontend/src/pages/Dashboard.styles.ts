import styled from 'styled-components'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease-out;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const HeaderText = styled.div``

export const UserName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

export const UserPhase = styled.p`
  color: ${p => p.theme.colors.gray};
`

export const UserHandle = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray}99;
  margin-top: 4px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const MainCol = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-column: ${p => p.$fullWidth ? 'span 3' : 'span 2'};
  }
`

export const SideCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Card = styled.div`
  background: ${p => p.theme.colors.secondary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  border-radius: 12px;
  padding: 20px;
`

export const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.quaternary};
`

export const PhaseTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.white};
`

export const PhaseSubtitle = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
`

export const FlavorText = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.gray};
  margin-top: 12px;
  font-style: italic;
`

export const MissionsSectionLabel = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.gray};
  margin-bottom: 12px;
`

export const MissionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`

export const EmptyMissionsText = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.gray}99;
  font-size: 14px;
  padding: 16px 0;
`

export const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
  margin-bottom: 4px;
`

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors.primary};
  border: 1px solid ${p => p.theme.colors.tertiary};
  color: ${p => p.theme.colors.white};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: ${p => p.theme.colors.gray}60; }
  &:focus { border-color: ${p => p.theme.colors.quaternary}; }
`

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const IndicatorRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const IndicatorLabel = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.gray};
`

export const IndicatorValue = styled.span<{ $accent?: boolean; $success?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$success ? p.theme.colors.success : p.$accent ? p.theme.colors.quaternary : p.theme.colors.white};
`

export const Divider = styled.div`
  border-top: 1px solid ${p => p.theme.colors.white}0d;
  padding-top: 8px;
  margin-top: 4px;
`

export const ErrorText = styled.p`
  color: ${p => p.theme.colors.warning};
  font-size: 14px;
`

export const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`
